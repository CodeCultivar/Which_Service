# Which Service

Search a movie or show and see which of **your** streaming services carry it.

![Which Service showing sample results: lit services carry the title, dimmed ones don't](docs/screenshot.png)

*Sample data with invented titles. Service logos appear after you add a TMDB key.*

Which Service is a single web page. Search a title and each result shows the description, a row of twelve services, and the cast. Services that carry the title are **lit** with a ✓, a few get a **$** when you can only rent or buy the title there, and the rest are dimmed. Select a lit service to search for the title on that service, or select an actor to see their biography and filmography. No server, no build step, no dependencies.

## Services

Disney+, Hulu, HBO Max, Netflix, YouTube TV, YouTube Premium, Apple TV+, Peacock, Paramount+, Prime Video, Crunchyroll and Starz.

Prime Video and YouTube Premium light up only when the title is **included** with that subscription. Renting or buying on Amazon Video or YouTube does not light them. Apple TV+ also shows a **$** for titles you can rent or buy in the Apple TV store.

The list lives in the `SERVICES` array near the top of the `<script>` in `index.html`. Each entry matches TMDB's provider by id and by name, which also catches channel and premium variants (for example "Peacock Premium" or "Paramount Plus Apple TV Channel"). To change the list, edit `SERVICES`, plus the matching entry in `TILE` (the colour of the letter tile shown when a logo is missing).

## How it works

Availability comes from [TMDB](https://www.themoviedb.org/) watch-provider data, which is supplied by JustWatch. The app:

1. Searches TMDB (`/search/multi`) for movies and series.
2. Reads each result's description from the search results, and looks up each result's watch providers (`/{movie|tv}/{id}/watch/providers`) for your region.
3. Marks each of your services as included, rent or buy, or not available, and lists titles you can watch first.
4. Loads the top cast for each result (`/{movie|tv}/{id}/credits`) after the results appear, so a slow cast never delays availability.
5. Opens a person page on demand (`/person/{id}` and `/person/{id}/combined_credits`).
6. Fetches service logos from TMDB, and falls back to coloured letter tiles when a logo is not available.

**Links:** TMDB can say that a service carries a title, but it has no link to the title's own page inside the service. A lit service therefore opens **that service's search page for the title**, which is one tap from the title. Those addresses are in the `SEARCH` object in `index.html`. If a service changes its site, edit its line. "All watch options" opens TMDB's own watch page for the title.

**Limits:** this reads public availability data. It cannot see inside your accounts, so it does not know your personal libraries or purchases. Data can lag behind reality, and a service that TMDB does not list (YouTube TV may be one) will always show as not available.

## Setup

1. Make a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. In your TMDB account, open Settings, then API, and request a developer key.
3. Open `index.html` in Chrome (or any modern browser), or use the hosted page (see below).
4. Open the **Settings** tab, paste your **API Key** or **API Read Access Token**, and choose **Save and test key**.

Until a key is saved, the app shows invented sample titles so you can see the layout. Searching without a key sends you to Settings, and your search runs as soon as the key is saved.

If the browser blocks requests when you open the file directly, serve the folder instead:

```sh
python3 -m http.server
# then open http://localhost:8000
```

## Using it

- **Search tab:** type a title and press Enter. Each result has a description (select **More** for the full text), a row of the twelve services, and the top cast.
- **Services row:** lit services are links that open the service's search for the title. Dimmed services are not links.
- **Queue:** choose **Add to queue** on a result to save it to the end of your list. The Queue tab keeps your order (top is next), and you can move a title with **Top**, **Up** and **Down**. **Mark watched** moves it to a Watched section at the bottom, and **Mark unwatched** puts it back on top. Each time you open the tab it re-checks where every title streams. The queue is saved in this browser only and needs a TMDB key.
- **Cast:** select a name to open their person page: photo, basic facts (born, birthplace, known for), biography, and a filmography you can filter to movies or TV. Select a credit to search where it streams. The browser Back button returns to your results.
- **Services tab:** the twelve services with logos, and what the lit, $ and dimmed marks mean.
- **Sign in:** the button at the top right of every page opens the sign-in page. **Sign in with Google** keeps your queue the same on every device you sign in on, automatically. Once signed in, the button shows your first name, and its page has **Sign out**. Only the queue is stored (in a free Firebase project, under your Google account), never your TMDB key. It works from the web address, not from a file opened on your computer.
- **Key box:** once a working key is saved, Settings shows only **Replace key**, **Remove key** and **Use sample data**. Choose **Replace key** to show the paste box again, or **Cancel** to hide it.
- **Shared queues:** when you are signed in, the Queue tab has a row of queues to switch between: **My queue** and any shared queues. Managing them is on the **Settings** tab (the Queue tab links there with **Manage in Settings**): **+ New shared queue** makes one, and every shared queue you are in gets its own card there with its members and **Open**, **Invite**, **Rename**, **Leave** and **Delete queue**. **Invite** shares a link (or copies it) that works for 7 days. Whoever opens the link and signs in with Google can join. The creator can **Remove** a member (which also cancels old links) and **Reset invite links** at any time. Everyone in a shared queue can add, reorder, mark watched and remove titles, and changes appear on everyone's screen within a few seconds. **Add to** on a search result adds to the queue you have selected, and **Add to my queue** copies a title from a shared queue into your own. **Rename** lets any member change the queue's name. **Leave** removes you (if you created the queue and others are in it, you first pick who takes over), and the last person to leave deletes the queue. Only the person who created a queue sees **Delete queue**, which deletes it for everyone after a second tap. Treat an invite link like a password until it expires: anyone who has it can join. Invite links made before this change no longer work. If two people save at the same moment, the last save wins.
- **My services:** in Settings, check or uncheck each of the twelve services. Unchecked ones are treated as not yours: they no longer count toward "on your services", the queue summary lines, or **Only show titles I can watch**, and they are dimmed on the Services tab. The choice is saved on the device, and in your account when signed in, so it follows you across devices.
- **Collapsible rows:** each queued title is collapsed by default to its name, a short description and a line of the services that have it. Tap a row (title or poster) to open it and see the cast, the full service grid and the controls; tap again to close. **Expand all / Collapse all** above the queue does every row at once.
- **Move to another queue:** open a title and tap **Move to…** to send it from your queue to a shared queue (or from a shared queue back to yours, or between shared queues). It leaves the current queue and joins the end of the other one's to-watch list, unwatched.
- **Settings tab:** the TMDB key, region, "Only show titles I can watch", .
- **Light and dark:** the page follows your system setting.

## Host it on GitHub Pages

1. In the repository, add the secrets described under **Keys and the build** below.
2. Open **Settings → Pages** and set Source to **GitHub Actions**.
3. Run the **Deploy to GitHub Pages** workflow (Actions tab, Run workflow), or push a change to `main`. After a minute or two the page is live at `https://<your-user>.github.io/<repo-name>/`.

If you leave out the optional `TMDB_KEY` secret, each visitor pastes their own TMDB key, which stays in their own browser. On a free GitHub account, Pages needs a public repository. Your key and settings on the hosted page are separate from the ones you saved when opening the file locally.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: markup, styles and script. |
| `assets/favicon.svg` | The icon as an SVG (Chrome, Firefox and Edge tabs). |
| `assets/icon-32.png`, `assets/icon-192.png` | PNG tab icons. Safari needs these. |
| `assets/apple-touch-icon.png` | 180px icon used when the page is added to an iPhone or iPad home screen. |
| `scripts/build.mjs` | Fills in the keys from secrets and writes the site to `dist/`. |
| `.github/workflows/pages.yml` | Builds and deploys the site to GitHub Pages on each push. |
| `docs/screenshot.png` | The screenshot above. |

## Keys and the build

The published site is built by GitHub Actions (`.github/workflows/pages.yml`, `scripts/build.mjs`). The build copies `index.html` and `assets/` into `dist/` and fills in two placeholders from repository secrets:

| Secret | Fills in | Needed |
| --- | --- | --- |
| `FIREBASE_API_KEY` | `__FIREBASE_API_KEY__` (Google sign-in and sync) | Yes, the build fails without it |
| `TMDB_KEY` | `__TMDB_KEY__` (the site works on every device with no pasting) | No. Without it each device pastes its own key in Settings |

**These keys are still visible in the published page.** A static site has to send them to the browser. Secrets keep them out of the repository's source and history, not out of view. To limit misuse, restrict the Firebase key to your site in Google Cloud (Credentials, your API key, Websites, `https://codecultivar.github.io/*`). TMDB keys are free and can be revoked. The Firestore rules are what protect your queue.

**Setup:** in the repo, add both secrets under Settings, Secrets and variables, Actions. Then set Settings, Pages, Source to **GitHub Actions**. Each push to `main` rebuilds and deploys.

**Settings:** when the build includes `TMDB_KEY`, the TMDB key box is hidden and the site always uses that key. When it doesn't (a local copy, or no secret set), the box shows so you can paste a key.

**Local copy:** opening `index.html` straight from the repo has no keys filled in, so paste a TMDB key in Settings. Sync is off there. To test the build locally: `FIREBASE_API_KEY=... TMDB_KEY=... node scripts/build.mjs`, then open `dist/index.html`.

## Firestore rules

Sync, shared queues and the Admin page need these rules in Firebase (Firestore Database, Rules, Publish). The same text is in [`firestore.rules`](firestore.rules).

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function signedIn() {
      return request.auth != null;
    }
    // The app owner's Google account. Used only by the Admin page to count accounts and shared queues.
    function isAdmin() {
      return signedIn()
        && request.auth.token.email == 'tjmaco@gmail.com'
        && request.auth.token.email_verified == true;
    }
    function changed() {
      return request.resource.data.diff(resource.data).affectedKeys();
    }
    function userDoc(uid) {
      return /databases/$(db)/documents/users/$(uid);
    }

    // ---------- Your own document: personal queue, list of shared queues, services, counter ----------
    function okUser(d) {
      return (!('queue' in d) || (d.queue is list && d.queue.size() <= 500))
        && (!('lists' in d) || (d.lists is list && d.lists.size() <= 60))
        && (!('svcOff' in d) || (d.svcOff is list && d.svcOff.size() <= 20))
        && (!('created' in d) || (d.created is int && d.created <= 50));
    }
    match /users/{uid} {
      allow get: if signedIn() && request.auth.uid == uid;
      allow list: if isAdmin();
      allow create: if signedIn() && request.auth.uid == uid
        && okUser(request.resource.data)
        && request.resource.data.get('created', 0) <= 1;
      allow update: if signedIn() && request.auth.uid == uid
        && okUser(request.resource.data)
        && changed().hasOnly(['queue', 'rev', 'updated', 'lists', 'svcOff', 'created'])
        // the "queues created" counter can only go up, one at a time
        && (request.resource.data.get('created', 0) == resource.data.get('created', 0)
          || request.resource.data.get('created', 0) == resource.data.get('created', 0) + 1);
    }

    // ---------- Shared queues ----------
    function okList(d) {
      return d.name is string && d.name.size() >= 1 && d.name.size() <= 40
        && d.members is list && d.members.size() >= 1 && d.members.size() <= 20
        && d.owner in d.members
        && d.memberInfo is map && d.memberInfo.size() <= 20
        && d.queue is list && d.queue.size() <= 500;
    }
    function isMember() {
      return request.auth.uid in resource.data.members;
    }
    // Any member: change the titles or the name, nothing else.
    function memberEdit() {
      return isMember() && changed().hasOnly(['queue', 'rev', 'updated', 'name']);
    }
    // Exactly one person leaves the member list, and their name goes with them.
    function oneRemoved() {
      return changed().hasOnly(['members', 'memberInfo'])
        && resource.data.members.hasAll(request.resource.data.members)
        && request.resource.data.members.size() == resource.data.members.size() - 1
        && request.resource.data.memberInfo.diff(resource.data.memberInfo).addedKeys().size() == 0
        && request.resource.data.memberInfo.diff(resource.data.memberInfo).changedKeys().size() == 0
        && request.resource.data.memberInfo.keys().hasOnly(request.resource.data.members);
    }
    // A member leaves (removes only themselves), or the creator removes someone else.
    function removal() {
      return isMember() && oneRemoved()
        && (!(request.auth.uid in request.resource.data.members) || resource.data.owner == request.auth.uid);
    }
    // The creator hands the queue to another member and leaves in the same step.
    function handover() {
      return resource.data.owner == request.auth.uid
        && changed().hasOnly(['owner', 'members', 'memberInfo'])
        && request.resource.data.owner != request.auth.uid
        && request.resource.data.owner in resource.data.members
        && request.resource.data.members == resource.data.members.removeAll([request.auth.uid])
        && request.resource.data.memberInfo.keys().hasOnly(request.resource.data.members);
    }
    // The creator cancels every invite link sent so far.
    function resetLinks() {
      return resource.data.owner == request.auth.uid
        && changed().hasOnly(['inviteGen'])
        && request.resource.data.inviteGen == resource.data.get('inviteGen', 0) + 1;
    }
    // Someone with a live invite adds only themselves.
    function joinWithInvite(listId) {
      let inv = get(/databases/$(db)/documents/invites/$(request.resource.data.joinCode)).data;
      return !isMember()
        && changed().hasOnly(['members', 'memberInfo', 'joinCode'])
        && request.resource.data.members == resource.data.members.concat([request.auth.uid])
        && request.resource.data.memberInfo.diff(resource.data.memberInfo).affectedKeys().hasOnly([request.auth.uid])
        && request.resource.data.memberInfo[request.auth.uid].n is string
        && request.resource.data.memberInfo[request.auth.uid].n.size() <= 40
        && inv.list == listId
        && inv.gen == resource.data.get('inviteGen', 0)
        && inv.exp > request.time;
    }
    match /lists/{listId} {
      // Members only. Reading a queue that no longer exists is allowed, so the app can tell it was deleted.
      allow get: if signedIn() && (resource == null || isMember());
      allow list: if isAdmin();
      // Created together with your counter going up by one (at most 50 per account).
      allow create: if signedIn()
        && request.resource.data.owner == request.auth.uid
        && request.resource.data.members == [request.auth.uid]
        && request.resource.data.get('inviteGen', 0) == 0
        && okList(request.resource.data)
        && getAfter(userDoc(request.auth.uid)).data.get('created', 0)
          == (exists(userDoc(request.auth.uid)) ? get(userDoc(request.auth.uid)).data.get('created', 0) : 0) + 1;
      allow update: if signedIn() && okList(request.resource.data)
        && (memberEdit() || removal() || handover() || resetLinks() || joinWithInvite(listId));
      allow delete: if signedIn() && resource.data.owner == request.auth.uid;
    }

    // ---------- Invite links: made by a member, good for 7 days, cancelled by Reset invite links ----------
    match /invites/{code} {
      allow get: if signedIn();
      allow create: if signedIn()
        && request.resource.data.keys().hasOnly(['list', 'gen', 'exp', 'name', 'by'])
        && request.resource.data.list is string
        && request.auth.uid in get(/databases/$(db)/documents/lists/$(request.resource.data.list)).data.members
        && request.resource.data.gen == get(/databases/$(db)/documents/lists/$(request.resource.data.list)).data.get('inviteGen', 0)
        && request.resource.data.exp is timestamp
        && request.resource.data.exp <= request.time + duration.value(7, 'd')
        && request.resource.data.name is string && request.resource.data.name.size() <= 40
        && request.resource.data.by is string && request.resource.data.by.size() <= 40;
    }
  }
}
```

What the rules enforce:

- **Shared queues are members-only.** Only members can read one (the owner's Google account can also count them for the Admin page).
- **Invite links expire and can be cancelled.** Invite makes a separate one-off code good for 7 days. Joining requires a live code for that queue. The creator's **Reset invite links** cancels every link sent so far, and removing a member does that automatically.
- **Members can only change the titles and the name.** Joining adds only yourself, leaving removes only yourself, only the creator can remove someone else, hand the queue over, reset links or delete it.
- **Limits:** queue names up to 40 characters, up to 500 titles in a queue, up to 20 people in a shared queue, and up to 50 shared queues created per account (a counter on your account that can only go up).

## Admin page

Signed in as the owner's Google account (`tjmaco@gmail.com`, set as `ADMIN_EMAIL` in `index.html`), the account page shows an **Admin** button. It opens counts of **accounts** (people who have signed in and synced) and **shared queues**, loaded with count queries so no one's titles are read. Other accounts never see the button. What really protects the numbers is the `isOwner()` rule above: without it the counts fail with "permission denied", so publish the updated rules first.

## Privacy and security

- Your TMDB key is stored in plain text in your browser's `localStorage` (key name `ws.key`). It leaves your browser only in requests to `api.themoviedb.org`.
- The repository contains no key. Never commit one.
- Anyone who can use your browser profile can read the key. When opened from `file://`, Chrome shares storage across local files, so serving from `localhost` or Pages gives the app its own storage. A TMDB key is free and read-only, and you can regenerate it in your TMDB account at any time.
- Saved in your browser (and, only if you sign in, your queue in Firebase): the key, region, the "only show titles I can watch" choice, your queue, and cached logo paths.

## Regions

United States, Canada, United Kingdom, Australia, Germany, France, Spain, Italy, Mexico, Brazil, Japan and India. Add more in the `REGIONS` object in `index.html`.

## Design

The page uses [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) from Google Fonts. If the font cannot load, it falls back to your system font.

## Attribution

Streaming availability data from JustWatch, provided through TMDB. Service logos from TMDB.

This product uses the TMDB API but is not endorsed or certified by TMDB. Keep this notice in the app, on the sign-in and account page.

Service names and logos belong to their respective owners.
