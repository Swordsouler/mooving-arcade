const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const isDev = require("electron-is-dev");

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
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

ipcMain.handle("execute-command", (event, command) => {
    console.log(`Executing command: ${command}`);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
    });
});
