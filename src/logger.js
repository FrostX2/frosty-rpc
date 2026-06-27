import { appendFileSync, mkdirSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { app } from "electron";

let LOG_FILE;

export function initLogger() {
  const logDir = join(app.getPath("userData"), "logs");
  if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
  LOG_FILE = join(logDir, "app.log");
  const header = `\n═══════ Session started ${new Date().toISOString()} ␊\n`;
  appendFileSync(LOG_FILE, header);
}

function formatLine(level, msg) {
  const time = new Date().toISOString().replace("T", " ").slice(0, 19);
  return `[${time}] [${level}] ${msg}\n`;
}

export function logInfo(msg) {
  const line = formatLine("INFO", msg);
  console.log(msg);
  try { appendFileSync(LOG_FILE, line); } catch {}
}

export function logWarn(msg) {
  const line = formatLine("WARN", msg);
  console.warn(msg);
  try { appendFileSync(LOG_FILE, line); } catch {}
}

export function logError(label, err) {
  const msg = err?.stack || err?.message || String(err);
  const line = formatLine("ERROR", `${label}: ${msg}`);
  console.error(label, err);
  try { appendFileSync(LOG_FILE, line); } catch {}
}

export function getLogContent() {
  try {
    if (!existsSync(LOG_FILE)) return "No logs yet.";
    return readFileSync(LOG_FILE, "utf-8");
  } catch {
    return "Failed to read log.";
  }
}

export function clearLog() {
  try {
    writeFileSync(LOG_FILE, `Log cleared at ${new Date().toISOString()}\n`);
  } catch {}
}

export function getLogPath() {
  return LOG_FILE;
}
