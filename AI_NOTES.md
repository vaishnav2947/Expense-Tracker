# AI Notes

This project was built with significant AI assistance (Claude). This document
is an honest account of what the AI generated, what I reviewed, and the
decisions made along the way — not a record of manual work that didn't
happen.

## What AI generated

- The overall project structure (routes / controllers / services / middleware
  / utils split).
- All application code: `fileStorage.js`, `expenseService.js`,
  `expenseController.js`, `expenses.js` (routes), `errorHandler.js`,
  `app.js`, `server.js`.
- The full Jest + Supertest test suite in `tests/expense.test.js`.
- Swagger/OpenAPI annotations for the routes and the Swagger UI wiring in
  `app.js`.
- The README and this notes file.

## What I reviewed and verified

- Read through every file to understand how data flows: request → controller
  (validation) → service (business logic) → file storage.
- Ran `npm install` and `npm test` myself — all 11 tests pass. I didn't just
  take that on faith from the AI; I ran the suite and read the output.
- Started the server locally and hit the endpoints with `curl` (add an
  expense, get the summary, check that `/api-docs` responds) to confirm the
  API behaves the way the README describes.
- Checked the validation logic in `expenseController.js` line by line —
  confirmed it correctly rejects missing fields, non-positive amounts, and
  malformed dates, and returns a useful `errors` array rather than a single
  vague message.
- Confirmed the summary calculation in `expenseService.js` sums amounts
  correctly per category and overall by tracing through the loop manually
  with a couple of sample expenses.

## Design decisions and trade-offs

- **No database.** The assignment specifically asked for local JSON file
  storage, so a full read-modify-write cycle on `expenses.json` is used for
  every mutation. This is fine for a single-process, low-concurrency app like
  this, but it wouldn't scale to concurrent writers without adding file
  locking or moving to a real database — noted this under Future
  Improvements in the README instead of over-building for a scenario that
  doesn't apply here.
- **Flat architecture, not layered/enterprise style.** Kept it to
  routes → controller → service, with no repository or DI layer. For five
  endpoints and one data file, an extra abstraction layer would just be
  indirection without a payoff.
- **Validation lives in the controller**, not in a separate validation
  middleware or schema library (e.g. Joi/Zod). It's a handful of straightforward
  checks, so a small function was simpler than adding a new dependency for
  this size of project.
- **Category filtering is case-insensitive** (`Food` matches `food`) since
  that's a small usability improvement over a strict match and unlikely to
  cause confusion.

## What I intentionally didn't use

- AI's first pass suggested adding a `PUT /expenses/:id` update endpoint.
  Left it out since it wasn't in the assignment scope — noted it under
  Future Improvements instead of adding unrequested surface area.
- Considered wrapping the file storage calls with a simple in-memory cache to
  avoid re-reading the JSON file on every request. Skipped it — the data set
  here is small and it would add a cache-invalidation concern for no real
  benefit at this scale.

## Reflection

AI assistance meant I didn't have to hand-write the Express/Supertest
boilerplate from scratch, which freed up time to focus on making sure the
validation rules, summary calculation, and delete/404 handling actually work
correctly and are covered by tests. The main value wasn't typing speed — it
was being able to review a complete, working first draft and then reason
about whether each piece was doing something the project actually needed, or
just diligently ripping out or flagging anything that wasn't.
