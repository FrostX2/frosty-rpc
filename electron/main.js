import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { startRPC, stopRPC, updateActivity, isConnected } from "../src/rpc.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let mainWindow = null;
let tray = null;

function loadConfig() {
  const configPath = join(__dirname, "..", "config.json");
  if (!existsSync(configPath)) return null;
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function saveConfig(config) {
  const configPath = join(__dirname, "..", "config.json");
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip("Custom Discord RPC");
  updateTrayMenu(false);
}

function updateTrayMenu(connected) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: connected ? "Connected" : "Disconnected",
      enabled: false,
    },
    { type: "separator" },
    {
      label: "Show Window",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: "Quit",
      click: () => {
        stopRPC();
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 540,
    height: 700,
    resizable: false,
    title: "Custom Discord RPC",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(join(__dirname, "..", "renderer", "index.html"));
  mainWindow.setMenu(null);

  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

app.on("ready", () => {
  createTray();
  createWindow();

  app.on("activate", () => {
    if (mainWindow) mainWindow.show();
    else createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopRPC();
    app.quit();
  }
});

app.isQuitting = false;
app.on("before-quit", () => {
  app.isQuitting = true;
});

ipcMain.handle("get-config", () => {
  return loadConfig();
});

ipcMain.handle("start-rpc", async (_event, id, config) => {
  try {
    saveConfig({ ...config, clientId: id });
    await startRPC(id, config, (status) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("rpc-status", status);
      }
      updateTrayMenu(status.connected);
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("stop-rpc", () => {
  stopRPC();
  updateTrayMenu(false);
  return { success: true };
});

ipcMain.handle("update-activity", async (_event, config) => {
  try {
    const saved = loadConfig() || {};
    saveConfig({ ...saved, ...config });
    await updateActivity(config);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("is-connected", () => {
  return isConnected();
});
