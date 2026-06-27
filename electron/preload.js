import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("rpcAPI", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  startRPC: (clientId, config) => ipcRenderer.invoke("start-rpc", clientId, config),
  stopRPC: () => ipcRenderer.invoke("stop-rpc"),
  updateActivity: (config) => ipcRenderer.invoke("update-activity", config),
  isConnected: () => ipcRenderer.invoke("is-connected"),
  onStatusChange: (callback) => {
    ipcRenderer.on("rpc-status", (_event, status) => callback(status));
  },
});
