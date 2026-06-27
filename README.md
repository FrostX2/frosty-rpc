# Custom Discord RPC

Cross-platform desktop app to set a fully custom Discord Rich Presence with auto-reconnect.

## Setup

```bash
npm install
```

## Usage

```bash
npm start
```

- Enter your Discord app's **Client ID**
- Customize every RPC field (text, images, timestamps, party, secrets, buttons)
- Click **Connect** — the app auto-reconnects if Discord disconnects
- Minimize to tray — the presence keeps running

## All Custom Fields

| Section  | Fields |
|----------|--------|
| Text     | details, state |
| Images   | large image key/tooltip, small image key/tooltip |
| Time     | start timestamp, end timestamp, elapsed toggle |
| Party    | party ID, size, max |
| Secrets  | join, spectate, match |
| Buttons  | up to 2 buttons with label + URL |

## Build

```bash
npx electron-builder
```

## Requirements

- Node.js 18+
- Discord desktop client running
