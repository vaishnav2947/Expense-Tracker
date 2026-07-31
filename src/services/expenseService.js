const { v4: uuidv4 } = require('uuid');
const { readExpenses, writeExpenses } = require('../utils/fileStorage');

async function getAllExpenses(category) {
  const expenses = await readExpenses();

  if (!category) return expenses;

  return expenses.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  );
}

async function addExpense({ title, amount, category, date }) {
  const expenses = await readExpenses();

  const newExpense = {
    id: uuidv4(),
    title,
    amount,
    category,
    date,
  };

  expenses.push(newExpense);
  await writeExpenses(expenses);

  return newExpense;
}

async function deleteExpense(id) {
  const expenses = await readExpenses();
  const index = expenses.findIndex((e) => e.id === id);

  if (index === -1) return null;

  const [removed] = expenses.splice(index, 1);
  await writeExpenses(expenses);

  return removed;
}

async function generateSummary() {
  const expenses = await readExpenses();

  const summary = {
    total: 0,
    categories: {},
  };

  for (const expense of expenses) {
    summary.total += expense.amount;
    summary.categories[expense.category] =
      (summary.categories[expense.category] || 0) + expense.amount;
  }

  return summary;
}

module.exports = {
  getAllExpenses,
  addExpense,
  deleteExpense,
  generateSummary,
};
