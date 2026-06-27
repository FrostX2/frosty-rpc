import { app, BrowserWindow, ipcMain } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { startRPC, stopRPC, updateActivity, isConnected } from "../src/rpc.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let mainWindow = null;

function loadConfig() {
  const configPath = join(__dirname, "..", "config.json");
  if (!existsSync(configPath)) return null;
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function saveConfig(config) {
  const configPath = join(__dirname, "..", "config.json");
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 620,
    resizable: false,
    title: "Custom Discord RPC",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(join(__dirname, "..", "renderer", "index.html"));
  mainWindow.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  stopRPC();
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("get-config", () => {
  return loadConfig();
});

ipcMain.handle("start-rpc", async (_event, clientId, config) => {
  try {
    saveConfig({ ...config, clientId });
    await startRPC(clientId, config);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("stop-rpc", () => {
  stopRPC();
  return { success: true };
});

ipcMain.handle("update-activity", async (_event, config) => {
  try {
    await updateActivity(config);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("is-connected", () => {
  return isConnected();
});
