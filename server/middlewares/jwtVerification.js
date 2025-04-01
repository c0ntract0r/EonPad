const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(req);
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No auth header!' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload);
        req.user = { user_id: payload.user_id, username: payload.sub };
        next();
    } catch(err) {
        if (err.name === 'TokenExpiredError') return res.status(StatusCodes.FORBIDDEN).json({msg: 'Token expired!' });
        return res.status(401).json({ msg: 'Invalid token!' });
    }
}

module.exports = verifyJWT;