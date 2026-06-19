# qBittorrent Unofficial Plugin Downloader

A browser console script that scrapes and downloads all `.py` plugin files from the qBittorrent unofficial search plugin listing page.

---

## What it does

- Finds all unique `.py` file links in the plugin table
- Deduplicates files by filename
- Downloads them sequentially to your machine with progress logging

---

## How to run

### 1. Go to the plugin listing page

Open the qBittorrent unofficial search plugins page in your browser:
```
https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins
```

### 2. Open DevTools

| Browser | Shortcut |
|--------|----------|
| Chrome / Edge | `F12` or `Ctrl + Shift + J` (Windows/Linux) / `Cmd + Option + J` (Mac) |
| Firefox | `F12` or `Ctrl + Shift + K` (Windows/Linux) / `Cmd + Option + K` (Mac) |

Click the **Console** tab.

### 3. Allow multiple downloads (Chrome/Edge)

Chrome and Edge block multiple automatic downloads by default. When prompted, click **Allow** in the address bar popup. You can also pre-allow it:

1. Click the **lock icon** in the address bar
2. Go to **Site settings**
3. Set **Automatic downloads** to **Allow**

### 4. Paste and run the script

Copy the script below and paste it into the console, then press `Enter`:

```js
const links = [...new Map(
  [...document.querySelectorAll("tbody a[href]")]
    .filter(a => a.href.endsWith(".py"))
    .map(a => [a.href.split("/").pop(), a])
).values()];

console.log(`Found ${links.length} unique Python files`);

for (const a of links) {
  const fileUrl = a.href;
  console.log(`Downloading: ${fileUrl.split("/").pop()}`);

  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = fileUrl.split("/").pop();
  document.body.appendChild(download);
  download.click();
  download.remove();
  URL.revokeObjectURL(url);
}

console.log("All downloads complete!");
```

### 5. Check your Downloads folder

All `.py` files will be saved to your browser's default download location.

---

## Notes

- The script runs **sequentially** to avoid overwhelming your browser with simultaneous requests
- If two plugins share the same filename, only the last one in the table is downloaded
- This only works when run directly on the plugin listing page (same-origin fetch)
- Tested on Chrome and Firefox

---


