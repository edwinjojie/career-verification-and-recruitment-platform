const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(env.MONGO_URI);
        logger.info('Connected to MongoDB');

        // Start HTTP Server
        const server = app.listen(env.PORT, () => {
            logger.info(`Candidate Service listening on port ${env.PORT}`);
        });

        // Graceful Shutdown
        const shutdown = () => {
            logger.info('Shutting down Candidate Service...');
            server.close(async () => {
                await mongoose.connection.close();
                logger.info('Database disconnected and server closed.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (err) {
        logger.error('Failed to start Candidate Service', { error: err.message });
        process.exit(1);
    }
};

startServer();
