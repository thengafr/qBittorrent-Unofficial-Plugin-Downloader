# qBittorrent Unofficial Plugin Downloader

Downloads all `.py` plugin files from the qBittorrent unofficial search plugins wiki page.

Two methods are available depending on your preference. The userscript method installs once and adds a button directly to the page, while the console method lets you run the script on demand without any extensions.

---

## Method 1 — Tampermonkey / Greasemonkey (Recommended)

Adds a persistent **Download All Plugins** button to the page. No copy-pasting needed after setup.

### Features

- One-click download button injected into the page
- Batched parallel downloads (5 at a time) for speed
- Auto-retry on failure (3 attempts with backoff)
- Live progress status overlay
- Reports any failed downloads at the end
- Deduplicates files by filename

### Step 1 — Install Tampermonkey or Greasemonkey

| Browser | Extension |
|--------|-----------|
| Chrome / Edge / Brave | [Tampermonkey](https://www.tampermonkey.net/) |
| Firefox | [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) |

### Step 2 — Install the userscript

1. Click on the Tampermonkey/Greasemonkey icon in your browser toolbar
2. Select **Create a new script** (Tampermonkey) or **New user script** (Greasemonkey)
3. Delete any existing content in the editor
4. Copy the contents of [`qbit-plugin-downloader.user.js`](./qbit-plugin-downloader.user.js) and paste it in
5. Press **Ctrl+S** (or **Cmd+S**) to save

### Step 3 — Run it

1. Go to the plugin listing page: https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins
2. A green **Download All Plugins** button will appear in the bottom-right corner
3. Click it

> **Chrome/Edge users:** When prompted to allow multiple downloads, click **Allow** in the address bar.

### Configuration

At the top of the script you can tweak these values:

```js
const BATCH_SIZE = 5;     // how many files download at once
const RETRIES = 3;        // retry attempts per file
const RETRY_DELAY = 1000; // base delay in ms between retries
```

---

## Method 2 — Browser Console

A quick one-time script you paste into the browser console. No extensions required.

### Step 1 — Go to the plugin listing page

https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins

### Step 2 — Open DevTools

| Browser | Shortcut |
|--------|----------|
| Chrome / Edge | F12 or Ctrl+Shift+J (Windows/Linux) / Cmd+Option+J (Mac) |
| Firefox | F12 or Ctrl+Shift+K (Windows/Linux) / Cmd+Option+K (Mac) |

Click the **Console** tab.

### Step 3 — Allow multiple downloads (Chrome/Edge)

Chrome and Edge block multiple automatic downloads by default. When prompted, click **Allow** in the address bar. You can also pre-allow it:

1. Click the lock icon in the address bar
2. Go to **Site settings**
3. Set **Automatic downloads** to **Allow**

### Step 4 — Paste and run the script

Copy the contents of [`console.js`](./console.js) into the console and press **Enter**.

### Step 5 — Check your Downloads folder

All `.py` files will be saved to your browser's default download location.

---

## Notes

- Both methods deduplicate files by filename — if two plugins share the same filename, only the last one in the table is downloaded
- Scripts only work when run on the plugin listing page due to browser same-origin restrictions
- Tested on Chrome and Firefox

---
