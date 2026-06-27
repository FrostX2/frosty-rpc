#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

OS="$(uname -s)"

case "$OS" in
  Darwin)
    exec bash other-distro/macos.sh
    ;;
  Linux)
    if command -v apt &>/dev/null; then
      exec bash other-distro/linux-debian.sh
    elif command -v dnf &>/dev/null; then
      exec bash other-distro/linux-fedora.sh
    elif command -v pacman &>/dev/null; then
      exec bash other-distro/linux-arch.sh
    elif command -v zypper &>/dev/null; then
      exec bash other-distro/linux-opensuse.sh
    else
      exec bash other-distro/linux-generic.sh
    fi
    ;;
  *)
    echo "Not Supported Operating System"
    echo "Detected: $OS"
    echo "Frozen RPC supports: Linux, macOS, Windows"
    exit 1
    ;;
esac
