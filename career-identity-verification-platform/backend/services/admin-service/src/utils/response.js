const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        requestId: res.req.requestId, // Assuming requestId attached to req
        timestamp: new Date().toISOString()
    });
};

module.exports = { success };
