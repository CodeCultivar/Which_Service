# Which Service

Search a movie or show and see which of **your** streaming services carry it.

Which Service is a single HTML file. Open it in a browser, search a title, and get a TV-guide-style grid showing whether it is **included**, **rent/buy only**, or **not available** on each of your services. There is no server, no build step and no dependencies.

## Services

Disney+, Hulu, HBO Max, Netflix, YouTube TV, Apple TV+, Peacock, Paramount+ and Crunchyroll.

The list is defined in the `SERVICES` array near the top of the `<script>` in `index.html`. Each entry matches TMDB's provider by id and by name, which also catches channel and premium variants (for example "Peacock Premium" or "Paramount Plus Apple TV Channel"). Edit that array to add or remove services.

## How it works

Availability comes from [TMDB](https://www.themoviedb.org/) watch-provider data, which is supplied by JustWatch. The app:

1. Searches TMDB (`/search/multi`) for movies and series.
2. Looks up each result's watch providers (`/{movie|tv}/{id}/watch/providers`) for your region.
3. Marks each of your services as included, rent/buy, or none, and sorts titles you can watch to the top.
4. Fetches service logos from TMDB, and falls back to letter tiles if a logo is not available.

**Limits:** this reads public availability data. It cannot see inside your accounts, so it does not know your personal libraries or purchases. Data can lag behind reality, and a service that TMDB does not list (YouTube TV may be one) will always show as unavailable.

## Setup

1. Make a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. In your TMDB account, open Settings, then API, and request a developer key.
3. Open `index.html` in Chrome (or any modern browser).
4. Go to the **Settings** tab, paste your **API Key** or **API Read Access Token**, and choose **Save and test key**.

Until a key is saved, the app shows invented sample titles so you can see the layout.

If the browser blocks requests when opening the file directly, serve the folder instead:

```sh
python3 -m http.server
# then open http://localhost:8000
```

## Using it

- **Search tab:** type a title and press Enter. Results show a verdict line and one cell per service.
- **Your services:** the list of services with logos. Use **Hide** or **Show** to collapse it; the choice is remembered.
- **Settings tab:** TMDB key, region, "Only show titles I can watch", and "Show my services".

## Privacy and security

- Your TMDB key is stored in plain text in your browser's `localStorage` (key name `ws.key`). It never leaves your browser except in requests to `api.themoviedb.org`.
- The repository contains no key. Never commit one.
- Anyone who can use your browser profile can read the key. Opened from `file://`, Chrome shares storage across local files, so serving from `localhost` gives the app its own storage. A TMDB key is free and read-only, and you can regenerate it in your TMDB account at any time.
- Settings are saved only in your browser: key, region, filter, whether the services list is shown, and cached logo paths.

## Regions

United States, Canada, United Kingdom, Australia, Germany, France, Spain, Italy, Mexico, Brazil, Japan and India. Add more in the `REGIONS` object in `index.html`.

## Attribution

Streaming availability data from JustWatch, provided through TMDB. Service logos from TMDB.

This product uses the TMDB API but is not endorsed or certified by TMDB. Keep this notice in the app's footer.

Service names and logos belong to their respective owners.
