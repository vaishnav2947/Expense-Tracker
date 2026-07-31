const express = require('express');
const controller = require('../controllers/expenseController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses, optionally filtered by category
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get('/', controller.getExpenses);

/**
 * @swagger
 * /expenses/summary:
 *   get:
 *     summary: Get total and category-wise expense summary
 *     responses:
 *       200:
 *         description: Expense summary
 */
router.get('/summary', controller.getSummary);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Add a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Validation error
 */
router.post('/', controller.createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found
 */
router.delete('/:id', controller.removeExpense);

module.exports = router;
