
<p align="center">
  <img src="assets/icon.png" alt="Frozen RPC" width="120">
</p>

<h1 align="center">❄️ Frozen RPC</h1>

<p align="center">
  <b>Cross-platform Discord Rich Presence Injector</b><br>
  <i>Local IPC • OAuth2 Gateway • Auto-Reconnect • Presets</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square">
  <img src="https://img.shields.io/github/package-json/v/FrostX2/frosty-rpc?style=flat-square&color=blueviolet">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
  <img src="https://img.shields.io/badge/electron-42.x-47848F?style=flat-square&logo=electron">
  <img src="https://img.shields.io/badge/discord-rpc-5865F2?style=flat-square&logo=discord">
</p>

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🎮 Two Connection Modes**
- **Local** — IPC via running Discord client
- **Inject** — Gateway + OAuth2, no client needed

**📋 Full RPC Support**
- Text, images, timestamps
- Party, secrets, buttons
- Instance flag

</td>
<td width="50%">

**🔐 OAuth2 Login**
- Authorize with Discord
- Token refresh & persistence
- Manage multiple accounts

**🔄 Auto-Reconnect**
- Exponential backoff
- Tray status indicator
- Seamless reconnect

</td>
</tr>
<tr>
<td width="50%">

**💾 Preset Manager**
- Save/load presets
- Full data export/import
- Quick switching

</td>
<td width="50%">

**📦 All Formats**
- Windows NSIS installer
- Linux: AppImage, DEB, RPM, Pacman, Flatpak
- macOS: DMG, PKG

</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/FrostX2/frosty-rpc.git
cd frosty-rpc
npm install

# 2. Launch
npm start
```

### Or use the universal launcher:

```bash
./shell/frozen-rpc.sh      # Linux / macOS
shell\frozen-rpc.bat       # Windows
```

> The launcher auto-detects your distro/OS and handles dependencies automatically.

---

## 📖 Usage Guide

### 1️⃣ Configure App
Go to **Settings** tab → enter your Discord Client ID & Secret

### 2️⃣ Authorize (Inject Mode)
Go to **Accounts** tab → click **Login with Discord** → authorize in browser

### 3️⃣ Set Your Presence
Go to **RPC** tab → fill in your rich presence → choose mode → **Connect**

### 4️⃣ Minimize to Tray
Presence keeps running while the app sits in your system tray.

### Mode Comparison

| Local Mode | Inject Mode |
|------------|-------------|
| Requires Discord client running | No local client needed |
| Uses IPC transport | Uses Gateway WebSocket |
| Just needs Client ID | Needs OAuth2 token |
| Limited to single client | Any account, anywhere |

---

## 📦 Installers

| Command | Produces |
|---------|----------|
| `npm run dist:win` | NSIS installer (`.exe`) |
| `npm run dist:linux` | AppImage + `.deb` + `.rpm` + `.pacman` |
| `npm run dist:mac` | DMG + PKG |
| `npm run dist:flatpak` | Flatpak bundle (`.flatpak`) |
| `npm run dist:all` | Everything for current OS |

All installers land in `../installer/` (project parent directory).

### Platform Details

| Format | OS | Install |
|--------|----|---------|
| 🪟 **NSIS** | Windows | `Frozen-RPC-Setup-*.exe` — auto-installs to `%APPDATA%`, Start Menu + Desktop shortcuts |
| 🐧 **AppImage** | Linux | `Frozen RPC-*.AppImage` — portable, double-click |
| 🐧 **DEB** | Debian/Ubuntu | `sudo dpkg -i frozen-rpc_*.deb` |
| 🐧 **RPM** | Fedora/RHEL | `sudo rpm -i frozen-rpc-*.rpm` |
| 🐧 **Pacman** | Arch | `sudo pacman -U frozen-rpc-*.pkg.tar.zst` |
| 🐧 **Flatpak** | Any Linux | `flatpak --user install frozen-rpc.flatpak` |
| 🍎 **DMG** | macOS | Drag to Applications |
| 🍎 **PKG** | macOS | Double-click installer |

---

## 🖥️ Desktop Integration

| OS | File | Install Command |
|----|------|----------------|
| 🐧 Linux | `shell/frozen-rpc.desktop` | `bash shell/install/linux-install-desktop.sh` |
| 🍎 macOS | `shell/Frozen RPC.app` | `bash shell/install/macos-install-app.sh` |
| 🪟 Windows | `shell/frozen-rpc.bat` | Double-click `shell/install/windows-shortcut.vbs` |

---

## 🗄️ Data Storage

| File | What's Inside |
|------|---------------|
| `rpc.db` | SQLite — accounts, presets, all config |
| `config/config.json` | Discord app credentials |

> Export/import everything from the **Accounts** tab.

---

## 🛠️ Requirements

- **Node.js** 18+ ([download](https://nodejs.org))
- **Discord desktop client** — only needed for Local mode
- **npm** — ships with Node.js

---

## 📁 Project Structure

```
frosty-rpc/
├── src/              Core application (main process, modules)
├── renderer/         Frontend (HTML, JS, CSS)
├── shell/            Launchers, distro scripts, install helpers
├── assets/           Icons and static assets
├── flatpak/          Flatpak manifest
├── config/           App credentials
└── package.json      Dependencies & build config
```

---

<p align="center">
  <sub>Built with ❤️ using Electron + discord-rpc + better-sqlite3</sub><br>
  <sub>MIT License · © FrostX2</sub>
</p>
