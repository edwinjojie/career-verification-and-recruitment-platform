const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors()); // Configure for internal/dashboard domains in production

// Body Parser
app.use(express.json());

// Logging & Request ID
app.use(requestLogger);

// Routes
app.use(routes);

// Error Handler (Catch-all)
app.use(errorHandler);

module.exports = app;
