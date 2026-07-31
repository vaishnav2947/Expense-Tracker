const fs = require('fs/promises');
const request = require('supertest');
const app = require('../src/app');
const { DATA_FILE } = require('../src/utils/fileStorage');

// Start each test run with a clean slate so results don't depend on
// leftover data from previous runs or the earlier manual testing.
beforeEach(async () => {
  await fs.writeFile(DATA_FILE, JSON.stringify([]));
});

afterAll(async () => {
  await fs.writeFile(DATA_FILE, JSON.stringify([]));
});

const sampleExpense = {
  title: 'Lunch',
  amount: 250,
  category: 'Food',
  date: '2026-07-31',
};

describe('POST /expenses', () => {
  it('creates a new expense and returns 201', async () => {
    const res = await request(app).post('/expenses').send(sampleExpense);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(sampleExpense);
    expect(res.body.id).toBeDefined();
  });

  it('rejects a request missing required fields', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ title: 'Lunch' });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('rejects a negative amount', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...sampleExpense, amount: -50 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(
      'amount is required and must be a positive number'
    );
  });

  it('rejects an invalid date format', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...sampleExpense, date: '31-07-2026' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(
      'date is required and must be in YYYY-MM-DD format'
    );
  });
});

describe('GET /expenses', () => {
  it('returns an empty list when no expenses exist', async () => {
    const res = await request(app).get('/expenses');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all expenses that have been added', async () => {
    await request(app).post('/expenses').send(sampleExpense);
    await request(app)
      .post('/expenses')
      .send({ title: 'Uber', amount: 400, category: 'Travel', date: '2026-07-30' });

    const res = await request(app).get('/expenses');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filters expenses by category', async () => {
    await request(app).post('/expenses').send(sampleExpense);
    await request(app)
      .post('/expenses')
      .send({ title: 'Uber', amount: 400, category: 'Travel', date: '2026-07-30' });

    const res = await request(app).get('/expenses?category=Food');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('Food');
  });
});

describe('GET /expenses/summary', () => {
  it('calculates overall and category-wise totals', async () => {
    await request(app).post('/expenses').send(sampleExpense); // Food, 250
    await request(app)
      .post('/expenses')
      .send({ title: 'Groceries', amount: 550, category: 'Food', date: '2026-07-29' });
    await request(app)
      .post('/expenses')
      .send({ title: 'Uber', amount: 400, category: 'Travel', date: '2026-07-30' });

    const res = await request(app).get('/expenses/summary');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1200);
    expect(res.body.categories).toEqual({ Food: 800, Travel: 400 });
  });

  it('returns zero total when there are no expenses', async () => {
    const res = await request(app).get('/expenses/summary');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.categories).toEqual({});
  });
});

describe('DELETE /expenses/:id', () => {
  it('deletes an existing expense', async () => {
    const created = await request(app).post('/expenses').send(sampleExpense);

    const res = await request(app).delete(`/expenses/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.expense.id).toBe(created.body.id);

    const remaining = await request(app).get('/expenses');
    expect(remaining.body).toHaveLength(0);
  });

  it('returns 404 when deleting an expense that does not exist', async () => {
    const res = await request(app).delete('/expenses/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Expense not found');
  });
});
