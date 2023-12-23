const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    readFile: async (filePath) => {
        try {
            const data = await ipcRenderer.invoke("read-file", filePath);
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    writeFile: async (filePath, data) => {
        try {
            await ipcRenderer.invoke("write-file", filePath, data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
});
