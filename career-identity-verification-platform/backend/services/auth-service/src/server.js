const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./config/logger');

const startServer = async () => {
    // Connect to Database
    await connectDB();

    app.listen(env.PORT, () => {
        logger.info(`Auth Service running on port ${env.PORT}`);
        logger.info(`Swagger Docs available at http://localhost:${env.PORT}/api-docs`);
    });
};

startServer();
