const { HTTP_RESPONSE_CODE } = require('../utils/constants');
const { logEvents } = require('./logger');

// handle errors, when user sends JSON in invalid format, so that the application won't break
const jsonErrorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      // JSON parsing error occurred
      const message = `${req.method}\t${req.url}\tInvalid JSON format: ${err.message}\t${req.headers.origin || 'Unknown origin'}`;
      logEvents(message, 'errLog.log');
      
      return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
        success: 'false',
        msg: 'Invalid JSON payload: The request contains malformed JSON',
      });
    }
  };

module.exports = { jsonErrorHandler };