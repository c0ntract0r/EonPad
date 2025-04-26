const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
    windowMs: 90 * 1000,
    limit: 5, // Each IP can request /login 5 times per window per minute
    message: {
        errorMessage: 'Too many login attempts from your IP, please try again in 90 seconds.'
    },
    handler: (req, res, next, options) => {
        logEvents(`${req.method}\t${req.baseUrl}\tToo many Requests; ${options.message.message}\t${req.headers.origin || 'Unknown origin'}`, 'errLog.log');
        return res.status(options.statusCode).json({'success': false, 'msg': options.message});
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

module.exports = loginLimiter;