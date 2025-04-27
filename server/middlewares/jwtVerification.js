const jwt = require('jsonwebtoken');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE } = require('../utils/constants');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // in case no authorization token is provided, or is invalid form
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ msg: APP_ERROR_MESSAGE.unauthorized });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) return res.status(HTTP_RESPONSE_CODE.FORBIDDEN).json({ success: false, msg: APP_ERROR_MESSAGE.forbiddenError });
            console.log(decoded);
            req.user = { user_id: decoded.user_id, username: decoded.username };
            next();
        }
    )
}

module.exports = verifyJWT;