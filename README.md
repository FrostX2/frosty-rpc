# Custom Discord RPC

Cross-platform desktop app to set custom Discord Rich Presence.

## Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Copy your **Client ID**
3. Install dependencies:

```bash
npm install
```

4. Launch the app:

```bash
npm start
```

## Usage

Enter your Client ID, customize the presence fields, and click **Connect**. Use **Update** to refresh the presence without disconnecting.

## Configuration

Settings are saved to `config.json` automatically when you connect.

## Build Distributable

```bash
npx electron-builder
```

## Requirements

- Node.js 18+
- Discord desktop client running
