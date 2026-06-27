document.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connectBtn");
  const updateBtn = document.getElementById("updateBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  const config = await window.rpcAPI.getConfig();

  function populateForm(cfg) {
    if (!cfg) return;
    document.getElementById("clientId").value = cfg.clientId || "";
    document.getElementById("details").value = cfg.details || "";
    document.getElementById("state").value = cfg.state || "";
    document.getElementById("largeImageKey").value = cfg.largeImageKey || "";
    document.getElementById("largeImageText").value = cfg.largeImageText || "";
    document.getElementById("smallImageKey").value = cfg.smallImageKey || "";
    document.getElementById("smallImageText").value = cfg.smallImageText || "";
    document.getElementById("showTime").checked = cfg.showTime !== false;

    if (cfg.buttons) {
      const labels = document.querySelectorAll(".btn-label");
      const urls = document.querySelectorAll(".btn-url");
      cfg.buttons.forEach((btn, i) => {
        if (labels[i]) labels[i].value = btn.label || "";
        if (urls[i]) urls[i].value = btn.url || "";
      });
    }
  }

  function readForm() {
    const buttons = [];
    document.querySelectorAll(".button-row").forEach((row) => {
      const label = row.querySelector(".btn-label").value.trim();
      const url = row.querySelector(".btn-url").value.trim();
      if (label && url) buttons.push({ label, url });
    });

    return {
      details: document.getElementById("details").value.trim(),
      state: document.getElementById("state").value.trim(),
      largeImageKey: document.getElementById("largeImageKey").value.trim(),
      largeImageText: document.getElementById("largeImageText").value.trim(),
      smallImageKey: document.getElementById("smallImageKey").value.trim(),
      smallImageText: document.getElementById("smallImageText").value.trim(),
      showTime: document.getElementById("showTime").checked,
      buttons,
    };
  }

  function setStatus(connected) {
    statusDot.className = "status-dot " + (connected ? "connected" : "disconnected");
    statusText.textContent = connected ? "Connected" : "Disconnected";
    connectBtn.disabled = connected;
    disconnectBtn.disabled = !connected;
    updateBtn.disabled = !connected;
  }

  populateForm(config);

  connectBtn.addEventListener("click", async () => {
    const clientId = document.getElementById("clientId").value.trim();
    if (!clientId) {
      statusText.textContent = "Enter a Client ID";
      return;
    }

    connectBtn.textContent = "Connecting...";
    connectBtn.disabled = true;

    const config = readForm();
    const result = await window.rpcAPI.startRPC(clientId, config);

    if (result.success) {
      setStatus(true);
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
      setTimeout(() => statusText.textContent = "Connected", 2000);
    } else {
      statusText.textContent = "Update failed";
    }
  });

  disconnectBtn.addEventListener("click", async () => {
    await window.rpcAPI.stopRPC();
    setStatus(false);
    connectBtn.textContent = "Connect";
  });
});
