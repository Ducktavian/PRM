# PRM
Personal Relationships Manager

## Run locally

From `backend`, install dependencies with `npm install`, then start the app with `npm start` (or `npm run dev` for automatic server restarts). Open `http://localhost:3000`.

Express renders the pages in `templates/pages` and their shared sidebar and top bar in `templates/partials`. Edit those EJS files for page markup. CSS, browser JavaScript, and assets remain in `frontend`; Express serves them as static files. The existing `.html` URLs still work, and there is no page build step.
