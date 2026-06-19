// ==UserScript==
// @name         qBittorrent Unofficial Plugin Downloader
// @namespace    https://github.com/
// @version      1.0.0
// @description  Adds a download button to grab all .py plugins from the qBittorrent unofficial search plugins wiki page
// @author       You
// @match        https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Config
  const BATCH_SIZE = 5;     // downloads at a time
  const RETRIES = 3;        // retries per file on failure
  const RETRY_DELAY = 1000; // ms between retries (doubles each attempt)

  // Button
  const btn = document.createElement("button");
  btn.textContent = "Download All Plugins";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    zIndex: "9999",
    padding: "12px 20px",
    background: "#2ea44f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  });

  // Status box
  const status = document.createElement("div");
  Object.assign(status.style, {
    position: "fixed",
    bottom: "80px",
    right: "30px",
    zIndex: "9999",
    padding: "10px 16px",
    background: "#1c1c1e",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "13px",
    maxWidth: "280px",
    display: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    lineHeight: "1.6",
  });

  document.body.appendChild(btn);
  document.body.appendChild(status);

  function setStatus(msg, color = "#fff") {
    status.style.display = "block";
    status.style.color = color;
    status.innerHTML = msg;
  }

  function getLinks() {
    return [...new Map(
      [...document.querySelectorAll("tbody a[href]")]
        .filter(a => a.href.endsWith(".py"))
        .map(a => [a.href.split("/").pop(), a.href])
    ).values()];
  }

  async function fetchWithRetry(url, attempt = 1) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      if (attempt >= RETRIES) throw e;
      await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
      return fetchWithRetry(url, attempt + 1);
    }
  }

  async function downloadFile(url) {
    const filename = url.split("/").pop();
    const res = await fetchWithRetry(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
    return filename;
  }

  async function downloadAll() {
    const links = getLinks();
    if (!links.length) {
      setStatus("No .py files found on this page.", "#ff6b6b");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Downloading...";
    btn.style.background = "#555";

    const failed = [];
    let done = 0;

    setStatus(`Found <b>${links.length}</b> plugins. Starting...`);

    for (let i = 0; i < links.length; i += BATCH_SIZE) {
      const batch = links.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (url) => {
          try {
            const name = await downloadFile(url);
            done++;
            setStatus(`Downloading...<br><b>${done}/${links.length}</b> — ${name}`);
          } catch (e) {
            failed.push(url.split("/").pop());
          }
        })
      );
    }

    if (failed.length) {
      setStatus(
        `Done. <b>${done}/${links.length}</b> downloaded.<br>Failed: ${failed.join(", ")}`,
        "#ffa94d"
      );
    } else {
      setStatus(`All <b>${links.length}</b> plugins downloaded.`, "#69db7c");
    }

    btn.textContent = "Download All Plugins";
    btn.style.background = "#2ea44f";
    btn.disabled = false;
  }

  btn.addEventListener("click", downloadAll);
})();
