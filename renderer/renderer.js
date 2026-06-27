document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id) => document.getElementById(id);

  const connectBtn = $("connectBtn");
  const updateBtn = $("updateBtn");
  const disconnectBtn = $("disconnectBtn");
  const statusDot = $("statusDot");
  const statusText = $("statusText");

  const config = await window.rpcAPI.getConfig();

  function populateForm(cfg) {
    if (!cfg) return;
    $("clientId").value = cfg.clientId || "";
    $("details").value = cfg.details || "";
    $("state").value = cfg.state || "";
    $("largeImageKey").value = cfg.largeImageKey || "";
    $("largeImageText").value = cfg.largeImageText || "";
    $("smallImageKey").value = cfg.smallImageKey || "";
    $("smallImageText").value = cfg.smallImageText || "";
    $("partyId").value = cfg.partyId || "";
    $("partySize").value = cfg.partySize ?? "";
    $("partyMax").value = cfg.partyMax ?? "";
    $("joinSecret").value = cfg.joinSecret || "";
    $("spectateSecret").value = cfg.spectateSecret || "";
    $("matchSecret").value = cfg.matchSecret || "";
    $("showTime").checked = cfg.showTime !== false;
    $("instance").checked = !!cfg.instance;

    if (cfg.startTimestamp) {
      $("startTimestamp").value = toDatetimeLocal(new Date(cfg.startTimestamp));
    }
    if (cfg.endTimestamp) {
      $("endTimestamp").value = toDatetimeLocal(new Date(cfg.endTimestamp));
    }

    if (cfg.buttons) {
      document.querySelectorAll(".button-row").forEach((row, i) => {
        const btn = cfg.buttons[i];
        if (btn) {
          row.querySelector(".btn-label").value = btn.label || "";
          row.querySelector(".btn-url").value = btn.url || "";
        }
      });
    }
  }

  function toDatetimeLocal(date) {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  function readForm() {
    const startVal = $("startTimestamp").value;
    const endVal = $("endTimestamp").value;

    let startTimestamp = undefined;
    let endTimestamp = undefined;

    if ($("showTime").checked && !startVal) {
      startTimestamp = Date.now();
    } else if (startVal) {
      startTimestamp = new Date(startVal).getTime();
    }

    if (endVal) {
      endTimestamp = new Date(endVal).getTime();
    }

    const buttons = [];
    document.querySelectorAll(".button-row").forEach((row) => {
      const label = row.querySelector(".btn-label").value.trim();
      const url = row.querySelector(".btn-url").value.trim();
      if (label && url) buttons.push({ label, url });
    });

    return {
      details: $("details").value.trim(),
      state: $("state").value.trim(),
      largeImageKey: $("largeImageKey").value.trim(),
      largeImageText: $("largeImageText").value.trim(),
      smallImageKey: $("smallImageKey").value.trim(),
      smallImageText: $("smallImageText").value.trim(),
      startTimestamp,
      endTimestamp,
      partyId: $("partyId").value.trim(),
      partySize: $("partySize").value !== "" ? parseInt($("partySize").value, 10) : undefined,
      partyMax: $("partyMax").value !== "" ? parseInt($("partyMax").value, 10) : undefined,
      joinSecret: $("joinSecret").value.trim(),
      spectateSecret: $("spectateSecret").value.trim(),
      matchSecret: $("matchSecret").value.trim(),
      instance: $("instance").checked,
      showTime: $("showTime").checked,
      buttons,
    };
  }

  function setStatus(connected, message) {
    statusDot.className = "status-dot " + (connected ? "connected" : "disconnected");
    statusText.textContent = message || (connected ? "Connected" : "Disconnected");
    connectBtn.disabled = connected;
    disconnectBtn.disabled = !connected;
    updateBtn.disabled = !connected;
    connectBtn.textContent = connected ? "Connected" : "Connect";
  }

  populateForm(config);

  window.rpcAPI.onStatusChange((status) => {
    setStatus(status.connected, status.message);
  });

  connectBtn.addEventListener("click", async () => {
    const clientId = $("clientId").value.trim();
    if (!clientId) {
      statusText.textContent = "Enter a Client ID";
      return;
    }

    connectBtn.textContent = "Connecting...";
    connectBtn.disabled = true;

    const config = readForm();
    const result = await window.rpcAPI.startRPC(clientId, config);

    if (result.success) {
      setStatus(true, "Connected");
    } else {
      statusDot.className = "status-dot disconnected";
      statusText.textContent = "Error: " + (result.error || "Connection failed");
      connectBtn.textContent = "Connect";
      connectBtn.disabled = false;
    }
  });

  updateBtn.addEventListener("click", async () => {
    const config = readForm();
    const result = await window.rpcAPI.updateActivity(config);
    if (result.success) {
      statusText.textContent = "Presence updated!";
      setTimeout(() => setStatus(true, "Connected"), 2000);
    } else {
      statusText.textContent = "Update failed";
    }
  });

  disconnectBtn.addEventListener("click", async () => {
    await window.rpcAPI.stopRPC();
    setStatus(false, "Disconnected");
  });
});
