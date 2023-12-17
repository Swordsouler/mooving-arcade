let ipcRenderer: any;

function getIpcRenderer() {
    if (typeof window !== "undefined") {
        return window.require("electron").ipcRenderer;
    }
    return null;
}

export function execute(command: string) {
    if (!ipcRenderer) ipcRenderer = getIpcRenderer();
    ipcRenderer.invoke("execute-command", command);
}

export function constructCommand(
    launcherPath: string,
    args: string | string[],
    gamePath: string
) {
    return `${launcherPath} ${args} "${gamePath}"`;
}
