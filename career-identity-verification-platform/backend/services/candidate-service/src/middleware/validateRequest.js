/**
 * Joi validation middleware factory
 * Returns middleware that validates request body against provided schema
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: errors
                }
            });
        }

        // Replace body with validated and sanitized value
        req.body = value;
        next();
    };
};

module.exports = validateRequest;
