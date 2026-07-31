const expenseService = require('../services/expenseService');

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateExpenseInput(body) {
  const errors = [];
  const { title, amount, category, date } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('title is required and must be a non-empty string');
  }

  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    errors.push('amount is required and must be a positive number');
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('category is required and must be a non-empty string');
  }

  if (!date || typeof date !== 'string' || !DATE_REGEX.test(date)) {
    errors.push('date is required and must be in YYYY-MM-DD format');
  }

  return errors;
}

async function getExpenses(req, res, next) {
  try {
    const { category } = req.query;
    const expenses = await expenseService.getAllExpenses(category);
    res.json(expenses);
  } catch (err) {
    next(err);
  }
}

async function createExpense(req, res, next) {
  try {
    const errors = validateExpenseInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const expense = await expenseService.addExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
}

async function getSummary(req, res, next) {
  try {
    const summary = await expenseService.generateSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

async function removeExpense(req, res, next) {
  try {
    const removed = await expenseService.deleteExpense(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted', expense: removed });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExpenses,
  createExpense,
  getSummary,
  removeExpense,
};
