const jwt = require('jsonwebtoken');
const Users = require('../../models/users');

const handleLogout = async (req, res) => {
    // on client, also delete the access token
    const cookies = req.cookies;
    if (!cookies?.refresh_jwt) return res.sendStatus(204);

    // is refresh token in database
    const refreshTokenDB = await Users.findOne(
        { "refreshTokenDocs.token": cookies.refresh_jwt },
        { "refreshTokenDocs.$": 1}    
    );
    if (!refreshTokenDB) {
        res.clearCookie('refresh_jwt', refreshToken, { httpOnly: true, maxAge: 5*60*1000 });
        return res.sendStatus(204)
    }
    
}