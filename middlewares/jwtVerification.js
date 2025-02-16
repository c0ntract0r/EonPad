const jwt = require('jsonwebtoken');
require('dotenv').config();
const { StatusCodes } = require('http-status-codes');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No auth header!' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { user: payload.userID, name: payload.username };
        next();
    } catch(err) {
        return res.status(StatusCodes.FORBIDDEN).json({ msg: 'Invalid token!' });
    }
}

module.exports = verifyJWT;