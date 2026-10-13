# Which Service

Search a movie or show and see which of **your** streaming services carry it.

![Which Service showing sample results: lit services carry the title, dimmed ones don't](docs/screenshot.png)

*Sample data with invented titles. Service logos appear after you add a TMDB key.*

Which Service is a single web page. Search a title and each result shows ten services in a fixed row. Services that carry the title are **lit** with a ✓, services where you can only rent or buy it get a **$**, and the rest are dimmed. No server, no build step, no dependencies.

## Services

Disney+, Hulu, HBO Max, Netflix, YouTube TV, Apple TV+, Peacock, Paramount+, Prime Video and Crunchyroll.

The list lives in the `SERVICES` array near the top of the `<script>` in `index.html`. Each entry matches TMDB's provider by id and by name, which also catches channel and premium variants (for example "Peacock Premium" or "Paramount Plus Apple TV Channel"). To change the list, edit `SERVICES`, plus the matching entry in `TILE` (the colour of the letter tile shown when a logo is missing).

## How it works

Availability comes from [TMDB](https://www.themoviedb.org/) watch-provider data, which is supplied by JustWatch. The app:

1. Searches TMDB (`/search/multi`) for movies and series.
2. Looks up each result's watch providers (`/{movie|tv}/{id}/watch/providers`) for your region.
3. Marks each of your services as included, rent or buy, or not available, and lists titles you can watch first.
4. Fetches service logos from TMDB, and falls back to coloured letter tiles when a logo is not available.

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

- **Search tab:** type a title and press Enter. Each result has a one-line verdict and a row of the ten services.
- **Your services:** the services list with logos. Use **Hide** or **Show** to collapse it. The choice is remembered.
- **Settings tab:** the TMDB key, region, "Only show titles I can watch", and "Show my services".
- **Light and dark:** the page follows your system setting.

## Host it on GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Set Source to **Deploy from a branch**, then choose branch `main` and folder `/ (root)`.
3. After a minute or two the page is live at `https://<your-user>.github.io/<repo-name>/`.

The hosted page is the same code for everyone: each visitor pastes their own TMDB key, which stays in their own browser. On a free GitHub account, Pages needs a public repository. Your key and settings on the hosted page are separate from the ones you saved when opening the file locally.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: markup, styles and script. The favicon is embedded in it. |
| `assets/favicon.svg` | The icon as a standalone SVG. |
| `assets/apple-touch-icon.png` | 180px icon used when the page is added to an iPhone or iPad home screen. |
| `assets/icon-32.png` | 32px PNG version of the icon. |
| `docs/screenshot.png` | The screenshot above. |

## Privacy and security

- Your TMDB key is stored in plain text in your browser's `localStorage` (key name `ws.key`). It leaves your browser only in requests to `api.themoviedb.org`.
- The repository contains no key. Never commit one.
- Anyone who can use your browser profile can read the key. When opened from `file://`, Chrome shares storage across local files, so serving from `localhost` or Pages gives the app its own storage. A TMDB key is free and read-only, and you can regenerate it in your TMDB account at any time.
- Saved in your browser only: the key, region, the "only show titles I can watch" choice, whether the services list is shown, and cached logo paths.

## Regions

United States, Canada, United Kingdom, Australia, Germany, France, Spain, Italy, Mexico, Brazil, Japan and India. Add more in the `REGIONS` object in `index.html`.

## Design

The page uses [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) from Google Fonts. If the font cannot load, it falls back to your system font.

## Attribution

Streaming availability data from JustWatch, provided through TMDB. Service logos from TMDB.

This product uses the TMDB API but is not endorsed or certified by TMDB. Keep this notice in the app's footer.

Service names and logos belong to their respective owners.
