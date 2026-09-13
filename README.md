# Talk Board

A simple, kid-friendly **AAC** (Augmentative and Alternative Communication) talk
board. Tap picture-word tiles to build a sentence in the strip at the top, then
tap 🔊 to speak it aloud. Built as an installable **Progressive Web App** — add
it to a phone or tablet home screen and it runs full-screen and works offline.

## Features

- **Core word board** organized by word type (pronouns, actions, describing
  words, social words, questions, yes/no) using a consistent color scheme.
- **Favorites** — star any word (in edit mode) to collect it on a ⭐ Favorites
  tab, which becomes the default landing view. Pair with **Simple mode** to hide
  the extra categories so a child sees a short, curated board (Favorites + Core).
- **Category tabs** (Food, Toys & Play, People, Places, Animals) that you can
  add to, rename, recolor, and delete.
- **Sentence strip** with tap-to-remove words, a clear button, and
  text-to-speech using the device's built-in voices.
- **Custom voice** — in parent controls, pick from the device's installed
  voices and tune speed/pitch (saved with the board, so it syncs). On iPad,
  add clearer voices via *Settings → Accessibility → Spoken Content → Voices*.
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
- **Optional Google sign-in** — recover your boards on any device and lock a
  board to your account (owner-only access). Layered on top of board codes;
  entirely optional.

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
5. **Enable Google sign-in** *(optional, for accounts)*: same *Sign-in method*
   page → enable **Google**. This powers optional sign-in for board recovery and
   locking a board to your account (see *Accounts* below). Skip it if you only
   want board codes.
6. **Authorize your site**: Authentication → *Settings* → *Authorized domains* →
   add `agiannelli.github.io` (and `localhost` for local testing).
7. **Paste your config** into `index.html`, in the `FIREBASE_CONFIG` block near
   the top of the `<script>`:

   ```js
   var FIREBASE_CONFIG = {
     apiKey: "…",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     appId: "…"
   };
   ```

8. **Set security rules** (Firestore → *Rules*). These let anyone signed in with
   a board's code use it, **unless** an owner has claimed it — then only that
   account (and anyone they add to `members`) can open it. Each user's private
   list of boards lives under `users/{uid}`:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {

       // Each user's private index of the boards they've opened.
       match /users/{uid}/{doc=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }

       match /boards/{code} {
         function ownerOf(d)   { return d.get('ownerUid', null); }
         function membersOf(d) { return d.get('members', []); }
         function isOwned(d)   { return ownerOf(d) != null; }
         function canAccess(d) {
           return request.auth != null && (
             !isOwned(d) ||
             ownerOf(d) == request.auth.uid ||
             request.auth.uid in membersOf(d)
           );
         }

         allow read:   if canAccess(resource.data);
         allow delete: if canAccess(resource.data);

         // A new board may be created unowned or owned by its creator.
         allow create: if request.auth != null && (
           request.resource.data.get('ownerUid', null) == null ||
           request.resource.data.get('ownerUid', null) == request.auth.uid
         );

         // Existing board: writer must have access, and ownership can only be
         // left unchanged or claimed by you on a currently-unowned board
         // (no taking over someone else's board).
         allow update: if canAccess(resource.data) && (
           request.resource.data.get('ownerUid', null) == ownerOf(resource.data) ||
           (!isOwned(resource.data) && request.resource.data.get('ownerUid', null) == request.auth.uid)
         );
       }
     }
   }
   ```

Then redeploy (commit + push) and, in the app, unlock parent controls →
**☁️ Cloud sync** → **Generate a code** (or type one) → **Connect**. Enter the
same code on any other device to share the board.

### Accounts (optional)

In **☁️ Cloud sync**, tap **Sign in with Google** (one time per device). Once
signed in you can:

- **Recover boards** — your connected boards are remembered under your account
  and listed as *Your boards* on any device you sign into, so you never lose one
  to a forgotten code.
- **Lock a board to your account** — tap *Make this board private to my account*.
  After that the code alone no longer grants access; only your Google account
  (and anyone added to the board's `members`) can open it. Reverse it with *Make
  shareable by code again*. This is the recommended setting once you add photos.

Sign-in persists, so the child never sees a login screen; a caregiver signs in
once in parent controls.

> **The board code is like a password.** For a *shareable* (unclaimed) board,
> anyone who knows the code can view and edit it — use the generated random codes
> and don't post them publicly. Claiming a board to your account removes that
> exposure. The `apiKey` in the config is *not* a secret — it only identifies
> your project; the security rules above are what actually protect the data.

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
