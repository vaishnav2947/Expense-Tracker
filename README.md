# Smart Expense Tracker

A small REST API for logging personal expenses, filtering them by category, and
getting a quick spending summary. Built with Express and a local JSON file for
storage — no database required.

## Features

- Add an expense (title, amount, category, date)
- View all expenses
- Filter expenses by category
- Get a summary of total spend, overall and by category
- Delete an expense by ID
- Input validation with clear error messages
- Swagger docs for exploring the API in the browser

## Tech Stack

- Node.js + Express
- `uuid` for generating expense IDs
- `fs/promises` for reading/writing the local JSON data file
- Jest + Supertest for testing
- `swagger-jsdoc` + `swagger-ui-express` for API docs

## Installation

```bash
npm install
```

## Running locally

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default (set `PORT` to change it).

Swagger docs are available at `http://localhost:3000/api-docs` once the server
is running.

## Running tests

```bash
npm test
```

Tests reset the data file before each run, so they won't interfere with
whatever's currently in `data/expenses.json`.

## API Endpoints

### `POST /expenses`

Add a new expense.

**Request body**

```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2026-07-31"
}
```

**Response** — `201 Created`

```json
{
  "id": "3f2a1b4c-...",
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2026-07-31"
}
```

Returns `400 Bad Request` with a list of validation errors if any field is
missing or invalid.

### `GET /expenses`

Returns all expenses.

### `GET /expenses?category=Food`

Returns expenses filtered by category (case-insensitive).

### `GET /expenses/summary`

Returns the total spend and a category-wise breakdown.

```json
{
  "total": 2300,
  "categories": {
    "Food": 800,
    "Travel": 1000,
    "Bills": 500
  }
}
```

### `DELETE /expenses/:id`

Deletes an expense by ID. Returns `404 Not Found` if the ID doesn't exist.

## Project Structure

```
expense-tracker/
├── README.md
├── AI_NOTES.md
├── package.json
├── .gitignore
├── data/
│   └── expenses.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   └── expenses.js
│   ├── controllers/
│   │   └── expenseController.js
│   ├── services/
│   │   └── expenseService.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── utils/
│       └── fileStorage.js
└── tests/
    └── expense.test.js
```

## Example Requests

```bash
# Add an expense
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","amount":250,"category":"Food","date":"2026-07-31"}'

# Get all expenses
curl http://localhost:3000/expenses

# Filter by category
curl "http://localhost:3000/expenses?category=Food"

# Get summary
curl http://localhost:3000/expenses/summary

# Delete an expense
curl -X DELETE http://localhost:3000/expenses/<id>
```

## Future Improvements

- Pagination for `GET /expenses` once the dataset grows
- Support editing an existing expense (`PUT /expenses/:id`)
- Date range filtering on top of category filtering
- Swap the JSON file for a real database if this needs to support concurrent
  writers
