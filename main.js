const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const store = new Store();

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: store.get("fullscreen", false), // get fullscreen state from store
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // set preload script
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.on("close", () => {
        store.set("fullscreen", mainWindow.isFullScreen()); // save fullscreen state on close
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Ici, nous interceptons toute tentative d'ouverture d'une nouvelle fenêtre.
        // Nous pouvons choisir de l'ouvrir dans le navigateur par défaut, de l'ouvrir dans une nouvelle fenêtre Electron,
        // ou de l'empêcher complètement.
        // Dans ce cas, nous choisissons de l'empêcher.
        return { action: "deny" };
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000" // Charger l'URL du serveur de développement de Next.js en mode développement
            : `file://${path.join(__dirname, "out/index.html")}` // Charger le fichier index.html en mode production
    );

    mainWindow.on("closed", () => {
        app.quit();
    });
};

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("kill-process", async (event, pid) => {
    process.kill(pid);
});

ipcMain.handle(
    "execute-command",
    async (
        event,
        { mainCommand, commandArgs, gamePath, launchDirectoryPath }
    ) => {
        const commandArgsArray = commandArgs.split(" ");
        commandArgsArray.push(gamePath);

        const child = spawn(mainCommand, commandArgsArray, {
            cwd: launchDirectoryPath,
        });

        child.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            event.sender.send("process-exit", child.pid);
        });

        child.on("error", (error) => {
            console.error(`Failed to start child process: ${error}`);
            dialog.showErrorBox(
                "Error",
                `Failed to start child process: ${error}`
            );
            event.sender.send("process-exit", child.pid);
        });

        return child.pid; // Return the PID
    }
);

ipcMain.handle("read-file", async (event, filePath) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
        return data;
    } catch (err) {
        console.error(err);
        // create empry file
        fs.writeFileSync(path.join(__dirname, filePath), "", "utf-8");
        console.log("create empty file");
        return "";
    }
});

ipcMain.handle("write-file", async (event, filePath, data) => {
    try {
        fs.writeFileSync(path.join(__dirname, filePath), data, "utf-8");
    } catch (err) {
        console.error(err);
    }
});

ipcMain.on("open-directory-dialog", (event) => {
    dialog
        .showOpenDialog({
            properties: ["openDirectory"],
        })
        .then((result) => {
            if (!result.canceled) {
                event.reply("selected-directory", result.filePaths[0]);
            }
        })
        .finally(() => {
            event.sender.send("dialog-closed");
        })
        .catch((err) => {
            console.log(err);
        });
});

ipcMain.handle("scan-games", async (event, args) => {
    const { emulatorName, gameDirectoryPath, imageDirectoryPath, extension } =
        args;

    // Vérifiez si le chemin du répertoire de jeu existe
    if (!fs.existsSync(gameDirectoryPath)) {
        throw new Error(
            `Le chemin du répertoire de jeu n'existe pas: ${gameDirectoryPath}`
        );
    }

    // Lire le contenu du répertoire de jeu
    const directoryContents = fs.readdirSync(gameDirectoryPath);

    // Filtrer les fichiers par extension
    const gameFiles = directoryContents.filter(
        (file) => path.extname(file) === extension
    );

    // Créer une liste de jeux
    const games = gameFiles.map((file) => {
        return {
            name: path.basename(file, extension),
            path: path.join(gameDirectoryPath, file),
            icon: path.join(
                imageDirectoryPath,
                path.basename(file, extension) + ".png"
            ),
            emulator: emulatorName,
            // Ajoutez d'autres propriétés de jeu ici
        };
    });

    return games;
});
