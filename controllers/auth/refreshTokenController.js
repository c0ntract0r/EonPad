const jwt = require('jsonwebtoken');
const Users = require('../../models/users');
require('dotenv').config();

const refreshTokenHandler = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refresh_jwt) return res.sendStatus(401);
    const refreshToken = cookies.refresh_jwt;
    const refreshTokenDB = await Users.findOne(
        { "refreshTokenDocs.token": cookies.refresh_jwt },
        { "refreshTokenDocs.$": 1}    
    );
    if (!refreshTokenDB) return res.sendStatus(403);
    jwt.verify(refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) => {
            console.log(decoded);
            if (err) return res.sendStatus(403);
            res.json({msg: "FUCK YOU"});
        }
    )
}

module.exports = { refreshTokenHandler };