const ApiError = require('../errors/ApiError');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const details = error.details.map(d => d.message);
            return next(ApiError.badRequest('Validation Failed', details));
        }
        next();
    };
};

module.exports = validateRequest;
