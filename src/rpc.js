import { Client } from "discord-rpc";

let rpc = null;

export function startRPC(clientId, config) {
  if (rpc) stopRPC();

  rpc = new Client({ transport: "ipc" });

  rpc.on("ready", () => {
    console.log(`RPC connected as ${rpc.user?.username}`);

    rpc.setActivity({
      details: config.details || "Playing a game",
      state: config.state || "In menu",
      startTimestamp: config.showTime ? Date.now() : undefined,
      largeImageKey: config.largeImageKey || undefined,
      largeImageText: config.largeImageText || undefined,
      smallImageKey: config.smallImageKey || undefined,
      smallImageText: config.smallImageText || undefined,
      buttons: config.buttons?.length ? config.buttons : undefined,
    });

    console.log("Rich Presence updated!");
  });

  rpc.on("disconnected", () => {
    console.log("Disconnected from Discord");
    rpc = null;
  });

  return rpc.login({ clientId });
}

export function stopRPC() {
  if (rpc) {
    rpc.destroy();
    rpc = null;
  }
}

export function updateActivity(config) {
  if (!rpc) return Promise.reject(new Error("RPC not connected"));

  return rpc.setActivity({
    details: config.details || "Playing a game",
    state: config.state || "In menu",
    startTimestamp: config.showTime ? Date.now() : undefined,
    largeImageKey: config.largeImageKey || undefined,
    largeImageText: config.largeImageText || undefined,
    smallImageKey: config.smallImageKey || undefined,
    smallImageText: config.smallImageText || undefined,
    buttons: config.buttons?.length ? config.buttons : undefined,
  });
}

export function isConnected() {
  return rpc !== null;
}
