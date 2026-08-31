# The long way back to you

A one-page trip tracker: a live countdown on a pastel boarding pass, an
animated route map, and a day-by-day timeline. All data is hardcoded — no APIs.

## Run it

```bash
npm install
npm run dev
```

## Change the content

Everything editable lives in **`src/data/trip.js`**:

- `people` — traveler name, and who they're flying to (`"you"` or a name)
- `reunion` — the exact reunion moment (keep the `-05:00` offset for Ecuador),
  plus the labels shown on the page
- `note` — the letter that opens when the bottom card is tapped
- `segments` — every stop: dates, city, country, emoji, blurb, `coords`
  (`[lat, lon]`, used for the "km apart" line) and `map: { x, y }` (0–1
  position on the route diagram)

## Deploy to Vercel

1. `git init && git add -A && git commit -m "trip timeline"`
2. Push to a new GitHub repo.
3. On vercel.com → **Add New → Project** → import the repo.
4. Framework preset is detected as **Vite**. Build command `vite build`,
   output `dist`. Nothing to configure — deploy.

Later edits: push to `main`, Vercel redeploys automatically.
