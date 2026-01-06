const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
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

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use(routes);

// Error Handler (Catch-all)
app.use(errorHandler);

module.exports = app;
