const mongoose = require('mongoose');
const logger = require('./logger');
const env = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        logger.info('MongoDB Connected Successfully');
    } catch (error) {
        logger.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
