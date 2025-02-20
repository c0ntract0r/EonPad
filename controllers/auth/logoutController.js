const jwt = require('jsonwebtoken');
const Users = require('../../models/users');

const handleLogout = async (req, res) => {
    // on client, also delete the access 
    const cookies = req.cookies;
    if (!cookies?.refresh_jwt) return res.sendStatus(401);
    const refreshToken = cookies.refresh_jwt;
    // is refresh token in database
    const foundUser = await Users.findOne({ refreshToken }).exec();
    console.log(foundUser);
    if (!foundUser) {
        res.clearCookie('refresh_jwt', refreshToken, { httpOnly: true });
        return res.sendStatus(204)
    }
    // Delete refresh token in database
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('refresh_jwt', refreshToken, { httpOnly: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };