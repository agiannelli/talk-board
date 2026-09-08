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
- **Local-first storage** — the board is saved on the device and works fully
  offline with no account.
- **Backup & Restore** — export the whole board to a `.json` file and import it
  on another device to copy your setup across tablets/phones.
- **Optional cloud sync** — connect two or more devices to the same **board
  code** and edits sync between them automatically (via Firebase Firestore).
  Off by default; the app works exactly the same without it.

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

You have two options:

**A. One-time copy (no setup, works offline)** — unlock parent controls →
**⬆️ Back up** → save the `.json`, move it to the other device (AirDrop, email,
cloud drive, etc.), then **⬇️ Restore** it there. Restoring **replaces** the
board on that device.

**B. Live cloud sync (keeps devices in step)** — set up Firebase once (below),
then on each device unlock parent controls → **☁️ Cloud sync** → enter the same
**board code**. Edits on one device appear on the others.

## Cloud sync setup (optional)

Cloud sync is off until you add a free Firebase project. It takes about five
minutes and costs nothing for this kind of use.

1. **Create a project** at <https://console.firebase.google.com> → *Add project*.
2. **Add a Web app** (the `</>` icon) and copy the `firebaseConfig` values it
   shows you.
3. **Enable Firestore**: Build → *Firestore Database* → *Create database* →
   Production mode.
4. **Enable Anonymous sign-in**: Build → *Authentication* → *Sign-in method* →
   enable **Anonymous**. (Sync uses this so the database isn't open to the whole
   internet — no login screen appears in the app.)
5. **Authorize your site**: Authentication → *Settings* → *Authorized domains* →
   add `agiannelli.github.io` (and `localhost` for local testing).
6. **Paste your config** into `index.html`, in the `FIREBASE_CONFIG` block near
   the top of the `<script>`:

   ```js
   var FIREBASE_CONFIG = {
     apiKey: "…",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     appId: "…"
   };
   ```

7. **Set security rules** (Firestore → *Rules*) so only signed-in users can read
   or write board documents:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /boards/{code} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

Then redeploy (commit + push) and, in the app, unlock parent controls →
**☁️ Cloud sync** → **Generate a code** (or type one) → **Connect**. Enter the
same code on any other device to share the board.

> **The board code is like a password.** Anyone who knows it can view and edit
> the board, so use the generated random codes and don't post them publicly.
> The `apiKey` in the config is *not* a secret — it only identifies your
> project; the security rules above are what actually protect the data.

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

With cloud sync **off** (the default), all data stays on the device in
`localStorage`. There are no analytics and no account; the only network calls
are loading web fonts.

With cloud sync **on**, the board contents are stored in *your own* Firebase
project and synced to the devices that share the board code. Nothing is sent
anywhere else, and turning sync off (**☁️ Cloud sync → Disconnect**) returns the
device to local-only.
