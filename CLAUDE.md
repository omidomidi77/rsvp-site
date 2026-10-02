# RSVP site — project rules

## Stack
- Plain HTML + CSS + vanilla JS (ES modules). No frameworks, no bundler, no npm dependencies.
- Business logic lives in pure modules (e.g. `rsvp.js`); DOM code lives in `app.js`.

## Commands
- Test: `npm test` (Node built-in test runner)
- Run locally: `npm run serve` → http://localhost:5173

## Conventions
- Every new pure function gets a test in `tests/*.test.js`.
- Use CSS custom properties from `:root` in `styles.css`; never hard-code colors.
- Accessible by default: every input has a `<label>`, status messages use `aria-live`.
- Run `npm test` before saying a task is done.

## Git
- Branch per issue: `issue-<number>-<short-slug>`.
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
