const jwt = require('jsonwebtoken');
const Users = require('../../models/users');
require('dotenv').config();
const genToken = require('../../utils/tokenCreator');

const refreshTokenHandler = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refresh_jwt) return res.sendStatus(401);
    const refreshToken = cookies.refresh_jwt;
    // Find user by his refresh token. Is this the best way?
    const foundUser = await Users.findOne(
        { "refreshTokenDocs.token": cookies.refresh_jwt },
        { "refreshTokenDocs.$": 1}).exec();

    // In case of detecting refresh token reuse
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);    // Forbidden
                // reuse attempt
                const targetUser = await Users.findOne({ username: decoded.username }).exec();
                targetUser.refreshToken = [];
                const result = await targetUser.save();
                console.log(result);
            }
        )
        return res.sendStatus(403);
    }

    // reissue a new refresh token
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(refreshToken,
        process.env.JWT_REFRESH_SECRET,
        async (err, decoded) => {
            // got an expired token
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            // If refresh token was still valid
            const newAccessToken = genToken(foundUser.username, 'a');
            const newRefreshToken = genToken(foundUser.username, 'r');
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // create the cookie as well. TBC in production
            res.cookie('refresh_jwt', newRefreshToken, { httpOnly: true, maxAge: 5*60*1000 });

            res.json({ newAccessToken });
        }
    );
}

module.exports = { refreshTokenHandler };