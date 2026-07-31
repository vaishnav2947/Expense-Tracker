const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const expenseRoutes = require('./routes/expenses');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Expense Tracker API',
      version: '1.0.0',
      description: 'A simple REST API for tracking personal expenses',
    },
  },
  apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Expense Tracker API is running' });
});

app.use(errorHandler);

module.exports = app;
