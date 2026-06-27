import { Client } from "discord-rpc";

let rpc = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let clientId = null;
let currentConfig = null;
let onStatusChange = null;

const MAX_RECONNECT_DELAY = 30000;
const INITIAL_RECONNECT_DELAY = 2000;

function buildActivity(config) {
  const activity = {};

  if (config.details) activity.details = config.details;
  if (config.state) activity.state = config.state;

  if (config.startTimestamp || config.endTimestamp) {
    activity.timestamps = {};
    if (config.startTimestamp) activity.timestamps.start = config.startTimestamp;
    if (config.endTimestamp) activity.timestamps.end = config.endTimestamp;
  }

  if (config.largeImageKey || config.largeImageText || config.smallImageKey || config.smallImageText) {
    activity.assets = {};
    if (config.largeImageKey) activity.assets.large_image = config.largeImageKey;
    if (config.largeImageText) activity.assets.large_text = config.largeImageText;
    if (config.smallImageKey) activity.assets.small_image = config.smallImageKey;
    if (config.smallImageText) activity.assets.small_text = config.smallImageText;
  }

  if (config.partyId || config.partySize || config.partyMax) {
    activity.party = {};
    if (config.partyId) activity.party.id = config.partyId;
    if (config.partySize !== undefined || config.partyMax !== undefined) {
      activity.party.size = [config.partySize || 0, config.partyMax || 0];
    }
  }

  if (config.matchSecret || config.joinSecret || config.spectateSecret) {
    activity.secrets = {};
    if (config.matchSecret) activity.secrets.match = config.matchSecret;
    if (config.joinSecret) activity.secrets.join = config.joinSecret;
    if (config.spectateSecret) activity.secrets.spectate = config.spectateSecret;
  }

  if (config.buttons?.length) {
    activity.buttons = config.buttons;
  }

  if (config.instance !== undefined) {
    activity.instance = config.instance;
  }

  return activity;
}

function createClient() {
  rpc = new Client({ transport: "ipc" });

  rpc.on("ready", () => {
    reconnectAttempts = 0;
    if (currentConfig) {
      const activity = buildActivity(currentConfig);
      rpc.setActivity(activity).catch(() => {});
    }
    if (onStatusChange) onStatusChange({ connected: true, message: "Connected" });
  });

  rpc.on("disconnected", () => {
    rpc = null;
    if (onStatusChange) onStatusChange({ connected: false, message: "Disconnected" });
    scheduleReconnect();
  });

  rpc.on("error", (err) => {
    if (onStatusChange) onStatusChange({ connected: false, message: err.message });
  });

  return rpc;
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  if (!clientId) return;

  reconnectAttempts++;
  const delay = Math.min(
    INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1),
    MAX_RECONNECT_DELAY
  );

  if (onStatusChange) {
    onStatusChange({ connected: false, message: `Reconnecting in ${Math.round(delay / 1000)}s...` });
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (onStatusChange) onStatusChange({ connected: false, message: "Reconnecting..." });
    createClient();
    rpc.login({ clientId }).catch(() => {});
  }, delay);
}

function cancelReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  reconnectAttempts = 0;
}

export function startRPC(id, config, statusCallback) {
  if (rpc) stopRPC();

  clientId = id;
  currentConfig = config;
  onStatusChange = statusCallback || null;

  cancelReconnect();

  createClient();
  return rpc.login({ clientId });
}

export function stopRPC() {
  cancelReconnect();
  if (rpc) {
    rpc.destroy();
    rpc = null;
  }
  clientId = null;
  currentConfig = null;
  onStatusChange = null;
}

export function updateActivity(config) {
  currentConfig = config;
  if (!rpc) return Promise.reject(new Error("RPC not connected"));

  const activity = buildActivity(config);
  return rpc.setActivity(activity);
}

export function isConnected() {
  return rpc !== null;
}

export function getReconnectAttempts() {
  return reconnectAttempts;
}
