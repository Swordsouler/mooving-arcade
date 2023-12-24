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
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    },
    removeListener: (channel, listener) => {
        ipcRenderer.removeListener(channel, listener);
    },
    invoke: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    },
});
