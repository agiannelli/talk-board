# Talk Board

A simple, kid-friendly **AAC** (Augmentative and Alternative Communication) talk
board. Tap picture-word tiles to build a sentence in the strip at the top, then
tap 🔊 to speak it aloud. Built as an installable **Progressive Web App** — add
it to a phone or tablet home screen and it runs full-screen and works offline.

## Features

- **Core word board** organized by word type (pronouns, actions, describing
  words, social words, questions, yes/no) using a consistent color scheme.
- **Category tabs** (Food, Toys & Play, People, Places, Animals) that you can
  add to, rename, recolor, and delete.
- **Sentence strip** with tap-to-remove words, a clear button, and
  text-to-speech using the device's built-in voices.
- **Parent controls** behind a *press-and-hold* lock so a child can't
  accidentally rearrange the board. In edit mode you can add / edit / reorder /
  delete words and categories.
- **Works offline** once loaded, and **installs** to the home screen.
- **Local-first storage** — the board is saved on the device. No account, no
  tracking, nothing leaves the device.
- **Backup & Restore** — export the whole board to a `.json` file and import it
  on another device to copy your setup across tablets/phones.

## Using it

1. Open the published URL (see below) on the device you want to use.
2. Tap **⬇️ Install app** in the footer (or use your browser's
   *Add to Home Screen*) to install it like a native app.
3. Tap tiles to build a sentence, then tap 🔊 to speak.

### Editing the board (parents)

1. Tap the ⚙️ gear, then **press and hold** *Hold to unlock* for one second.
2. Add, edit, reorder, or delete tiles and categories.
3. Tap **✓ Done editing** when finished.

### Moving your board to another device

There's no shared server, so each device keeps its own copy. To copy a board:

1. On the set-up device: unlock parent controls → **⬆️ Back up** → save the
   `.json` file.
2. Move that file to the other device (AirDrop, email, cloud drive, etc.).
3. On the other device: unlock parent controls → **⬇️ Restore** → pick the file.

> Restoring **replaces** the board on that device.

## Hosting

This is a static site — any static host works. It's set up for **GitHub Pages**:

- Repo **Settings → Pages → Build and deployment → Deploy from a branch**,
  branch `main`, folder `/ (root)`.
- The app uses only relative paths, so it works from a project-pages subpath
  like `https://<user>.github.io/<repo>/`.

To run locally, serve the folder over HTTP (service workers need `http`/`https`,
not `file://`):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (markup, styles, and logic). |
| `manifest.webmanifest` | PWA metadata (name, icons, colors, standalone display). |
| `sw.js` | Service worker for offline caching of the app shell. |
| `icons/` | App icons (192, 512, Apple touch, favicon). |

## Updating the app

When you change `index.html` or other shell files, bump the `CACHE` version
string near the top of `sw.js` (e.g. `talk-board-v1` → `talk-board-v2`) so
installed copies pick up the new version on next launch.

## Privacy

All data stays on the device in `localStorage`. There are no analytics, no
network calls except loading web fonts, and no account.
