# bitewise-meal-vision

Cloudflare Worker that proxies meal-photo analysis requests to the Gemini API,
keeping the API key off the client. Free tier only: Cloudflare Workers (no
card required) + Gemini API (no card required).

## One-time setup

```
cd worker
npm install
npx wrangler login          # opens a browser to authorize your Cloudflare account
npx wrangler secret put GEMINI_API_KEY   # paste your Google AI Studio key when prompted
npx wrangler secret put APP_SECRET       # make up any random string; the app must send the same value
npx wrangler deploy
```

`wrangler deploy` prints the deployed URL, e.g.
`https://bitewise-meal-vision.<your-subdomain>.workers.dev`. Put that URL and
the `APP_SECRET` value into `services/mealVision.ts` (`WORKER_URL` and
`APP_SECRET` constants) back in the app.

## Local dev

```
npm run dev
```

Runs the Worker locally via `wrangler dev` (needs the same secrets set, or
pass them via a local `.dev.vars` file — see Wrangler docs).
