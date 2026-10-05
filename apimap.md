# Replacing `games.json` — a practical guide

This document explains how to swap out the data behind the Panathinaikos calendar site (`https://paocalendar.netlify.app/games.json`) with your own — either by regenerating it from the same sources, or by pointing the frontend at a completely different dataset.

---

## 1. What `games.json` actually is

A single static JSON file served from the site root. The page fetches it once on load and re-renders the month grid, the agenda list, and the iCal output from it. There is **no backend API** — the file *is* the API.

Two top-level keys matter:

```jsonc
{
  "season": "2026-27",
  "generatedAt": "2026-10-03T13:41:30.742Z",   // ISO timestamp, shown in the About section
  "sources": [ /* metadata only — not fetched by the browser */ ],
  "games":   [ /* the actual events */ ]
}
```

### Minimum game shape

Every entry in `games[]` needs at least these fields for the frontend to render it:

```jsonc
{
  "id": "bb-el-2627-r3",              // stable, unique — used for merging + corrections
  "department": "basketball",          // "football" | "basketball" | "amateur"
  "sport": "basketball",               // football | basketball | volleyball | waterpolo | handball
  "squad": "men",                      // "men" | "women"
  "club": "KAE",                       // "PAE" | "KAE" | "AO"
  "competition": "EuroLeague",         // shown as the badge text
  "round": "3η αγωνιστική",            // optional, shown in the dialog
  "home": true,                        // only home games are rendered
  "opponent": "Maccabi Tel Aviv",
  "venue": "Telekom Center Athens",    // may be null → no map link
  "start": "2026-10-02T21:15",         // local Athens time, NO timezone suffix
  "timeConfirmed": true,               // false → rendered as "TBA"
  "durationMin": 120,                  // iCal DTEND = start + this
  "status": "scheduled",               // "scheduled" | "played"
  "publicNote": "…",                   // optional, shown in dialog
  "verification": {
    "verified": true,                  // false → "!" unverified marker
    "sourceId": "euroleague",          // must exist in sources[]
    "sourceUrl": "https://…",
    "checkedAt": "2026-10-02"          // null → treated as unverified
  }
}
```

### Rules the frontend relies on

- **`home: true` is the filter.** Away games may exist in the file but are ignored. Don't bother including them.
- **`start` has no `Z` and no offset.** It's interpreted as `Europe/Athens`. If you emit UTC, every game shifts by 2–3 hours. This is the single most common mistake.
- **`timeConfirmed: false` must be paired with `T00:00`** in `start`. The renderer shows "TBA" and emits an all-day event in iCal.
- **`id` must be stable across runs.** The nightly job merges by `id`; user corrections in `localStorage` are keyed by it too. Changing an id orphans any manual edit.
- **`department` drives the three filter buttons** (ΠΑΕ / ΚΑΕ / Α.Ο.). If you add a fourth value, the filter UI needs a matching button.

---

## 2. Option A — Regenerate from the same upstream sources

Use this if you want the same site but refreshed / corrected.

### 2a. The two real APIs

**EuroLeague** (one call, whole season):

```bash
curl 'https://api-live.euroleague.net/v2/competitions/E/seasons/E2026/games?teamCode=PAN' \
  -H 'Accept: application/json'
```

- Change `E2026` for a different season, `PAN` for a different club.
- Returns every game with `date`, `time`, `homeTeam`, `awayTeam`, `venue`, `round`.

**UEFA** (one call per match):

```bash
curl 'https://match.uefa.com/v5/matches?matchId=2050313'
```

- You need the `matchId` list first. There is no public season endpoint, so scrape the club page (`https://www.uefa.com/uefaconferenceleague/clubs/50084--panathinaikos/matches/`) once per run to collect the ids, then call `/v5/matches` per id.
- Undocumented and versioned (`/v5/`). Treat the response shape as unstable.

### 2b. Everything else is scraping

| `sourceId` | What you're scraping | Difficulty |
|---|---|---|
| `slgr` | `slgr.gr/en/game/{id}/` — one page per match | medium |
| `esake` | `esake.gr/el/action/EsakePrograms?...&series={n}` — one page per round | medium |
| `epo` | `epo.gr/el/competition/6/stage/1434/group/2100/matches` — whole season, one page | easy |
| `eok` | **a PDF** — `basket.gr/wp-content/uploads/.../WOMENS-BASKETBALL-LEAGUE-1.pdf` | hard |
| `fiba` | `fiba.basketball/en/events/{competition}/games` | medium |
| `koe` | `waterpololeague.gr/fixture/{greeklish-slug}-{date}` — slugs are hand-written, not derivable | hard |
| `eope` | `volleyball.gr/to-programma-tis-volley-league-gynaikon-2026-2027/` — whole season, one page | easy |
| `esap` | A **news article** listing the men's schedule | medium |
| `cev`, `cev-cl` | `www-old.cev.eu/Competition-Area/CompetitionView.aspx?ID=…&PID=…` | medium |
| `ea-cl` | Hash-routed SPA — you have to hit the underlying XHR | hard |
| `pao-fc`, `pao-bc`, `pao-ao` | Club sites, tier‑2, only used when nothing tier‑1 exists | easy |

### 2c. Assemble

1. Normalize each source into the game shape above.
2. Convert all times to `Europe/Athens` **local** and strip the offset.
3. Set `verification.verified` based on whether the source is tier‑1 (`true`) or a club site (`false`).
4. Merge by `id`. If two sources disagree, keep the tier‑1 one and log the conflict.
5. Write `{ season, generatedAt: new Date().toISOString(), sources, games }` to `games.json`.

A nightly job that does the above in ~200 lines of Node/Python is realistic; the scraping is 80% of the work.

---

## 3. Option B — Bring your own data

Use this if you just want the UI with different events.

1. **Produce a `games.json`** matching the schema in §1. You can hand-write it, generate it from a CSV, pull it from your own database, whatever.
2. **Drop it in the site root.** If you forked the Netlify site, it goes in whatever folder is published (usually `public/` for Vite, or the deploy root for a plain static build).
3. **Keep the filename.** If you rename it, you have to patch the fetch in `index-Cf7DFdNU.js`. Search the minified bundle for `games.json` — there will be exactly one string literal.
4. **Redeploy.** Netlify will serve the new file; the frontend picks it up on next load.

That's it. No server, no env vars, no API keys.

---

## 4. Replacing it on Netlify

### If you control the repo

```bash
git clone <your-fork>
cd <your-fork>
# edit public/games.json (or wherever it lives)
git add public/games.json
git commit -m "update fixtures"
git push
```

Netlify auto-deploys on push.

### If you don't control the repo

You can still serve your own `games.json` from a different origin and patch the frontend to fetch it. Two ways:

**4a. Deploy your own copy of the whole site**

1. Download the deployed HTML, CSS, JS, and `games.json` from `paocalendar.netlify.app`.
2. Replace `games.json` with yours.
3. Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
4. Optionally point a custom domain at it.

**4b. Keep the frontend, override the data via a service worker or CDN**

Only worth it if you can't fork. A tiny service worker that intercepts `GET /games.json` and returns your file works, but you'll need to register it — which means you're already editing the site. In practice 4a is simpler.

### Automating the refresh

Once your generator works locally, wire it up:

- **Netlify Scheduled Function** — `netlify/functions/refresh.mjs` with `export const config = { schedule: "@daily" }`. It fetches upstream, writes the JSON to a Blobs store or triggers a deploy hook.
- **GitHub Action** — cron job that runs your generator and commits `games.json`. Netlify redeploys on the commit. Simplest to reason about.
- **Netlify Build Plugin** — runs the generator at build time so the file is always fresh when the site deploys.

The original site's "Κάθε βράδυ στις 22:00 ώρα Ελλάδας (21:00 τη χειμερινή)" line implies one of the first two.

---

## 5. Gotchas

- **Timezones.** `start` is naive local Athens time. Emit `2026-10-02T21:15`, not `2026-10-02T21:15Z` and not `2026-10-02T18:15Z`. The DST switch is 25 Oct 2026 (GMT+3 → GMT+2); the frontend handles it in iCal export but not in your input.
- **`id` stability.** Don't derive ids from dates or opponents — derive them from something the source guarantees (round number, match id, competition + round). Otherwise every run looks like a full replacement and user corrections get orphaned.
- **`timeConfirmed: false` + non-midnight start** will render "TBA" but export a wrong time. Enforce the pairing in your generator.
- **Empty `games[]` is valid** but the grid renders blank. Add a sanity check that fails the build if the count drops by more than ~30% versus the previous run — that's how you catch a scraper that silently broke.
- **`verification.sourceId` must exist in `sources[]`.** If it doesn't, the About section's source list and the per-game "source" link both break silently.
- **The frontend caches.** After replacing `games.json`, hard-refresh (Ctrl/Cmd+Shift+R) or bust the Netlify cache. A stale SW or CDN edge can serve the old file for a while.
- **`localStorage` corrections survive a data swap.** If a user corrected a game and you later removed it from `games.json`, the correction lingers in their browser. Not a bug, but worth knowing if you're testing.

---

## 6. Quick verification checklist

After replacing the file:

```bash
# 1. Is it valid JSON?
jq empty games.json && echo OK

# 2. Does every game have the required keys?
jq '[.games[] | select((.id and .department and .sport and .squad and .club
     and .competition and .opponent and .start) | not)] | length' games.json
# → expect 0

# 3. Are any times carrying a UTC marker?
jq '[.games[] | select(.start | test("Z|[+-][0-9]{2}:[0-9]{2}$"))] | length' games.json
# → expect 0

# 4. Do all sourceIds resolve?
jq --slurpfile s <(jq '[.sources[].id]' games.json) \
   '[.games[] | select(.verification.sourceId as $x | $s[0] | index($x) | not)] | length' games.json
# → expect 0

# 5. Is timeConfirmed consistently paired with midnight?
jq '[.games[] | select(.timeConfirmed == false and (.start | endswith("T00:00") | not))] | length' games.json
# → expect 0
```

Then load the site, click through a month with games, and check that:
- the filter buttons still show the right counts,
- "Λήψη iCal" produces an `.ics` whose `TZID` is `Europe/Athens`,
- a game marked `verified: false` shows the `!` marker,
- the About section's "Τελευταία ενημέρωση" reflects your new `generatedAt`.

---

## 7. If you'd rather not maintain scrapers

The realistic alternatives, in order of effort:

1. **Manual CSV → JSON.** Keep a spreadsheet, export to JSON with a 20-line script. Fine for one club, one season, ~200 games.
2. **Use only the two real APIs.** EuroLeague + UEFA cover men's football and men's basketball. Everything else is scraping; if you don't care about amateur sports, drop them and set `department: "amateur"` games to nothing.
3. **Pay for a sports data feed.** Sportradar, Stats Perform, and API-Football all cover Greek leagues to varying degrees. API-Football in particular has a free tier that covers Super League, Basket League, and Volley League. Costs money past the free tier, but it's a single JSON shape instead of ten scrapers.
4. **Fork and freeze.** Snapshot the current `games.json`, correct it by hand for the season, redeploy once a week. Zero automation, zero breakage.

For a fan site of this size, option 1 or 4 is usually the right call.
