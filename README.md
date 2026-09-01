# Schema 52 — website

Single-page, full-bleed hero. Static HTML/CSS with a small amount of vanilla JS.
Implemented from the Claude Design handoff `S52 Hero 1f Full Bleed` (typography
pairing "b": Rethink Sans display / Plus Jakarta Sans text).

## Files

| File | Purpose |
|---|---|
| `index.html` | The page. All styles inline in `<head>`; interaction script inline at the end. |
| `mesh-gradient.js` | `<mesh-gradient>` custom element — looping WebGL mesh gradient background. Config baked in; `speed` attribute overrides. Falls back to a flat color if WebGL is unavailable. |
| `logos/schema52-mark-white.svg` | Brand mark in the header. |
| `google-apps-script/Code.gs` | Contact form backend (Google Apps Script web app). |

Fonts load from Google Fonts (Rethink Sans, Plus Jakarta Sans). No build step, no
dependencies — open `index.html` or serve the folder statically.

## Contact form

The modal form (`name`, `firm`, `email`) POSTs JSON to the Apps Script endpoint in
`FORM_ENDPOINT` (top of the inline script in `index.html`). The script appends a row
to the "Submissions" sheet and emails `NOTIFY_TO` in `Code.gs`.

To point at a new backend: deploy `Code.gs` as a web app (Execute as: Me, Access:
Anyone), then paste the `/exec` URL into `FORM_ENDPOINT`.

## Deploy

Static hosting. If the repo is linked to Vercel, pushing to `main` deploys it.
