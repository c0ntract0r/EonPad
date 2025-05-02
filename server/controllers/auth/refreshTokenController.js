const jwt = require('jsonwebtoken');
const Users = require('../../models/users');
const genToken = require('../../utils/tokenCreator');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE } = require('../../utils/constants');


const refreshTokenHandler = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refresh_jwt) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ 'success': false, msg: APP_ERROR_MESSAGE.unauthorized, data: [] });
    const refreshToken = cookies.refresh_jwt;
    // delete existing cookie, because new one will be issued anyways
    res.clearCookie('refresh_jwt', { httpOnly: true });
    const foundUser = await Users.findOne({ refreshToken }).exec();

    // In case of detecting refresh token reuse
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) return res.status(HTTP_RESPONSE_CODE.FORBIDDEN).json({'success': false, msg: APP_ERROR_MESSAGE.forbiddenError, data: []});
                // reuse attempt
                const targetUser = await Users.findOne({ username: decoded.username }).exec();
                targetUser.refreshToken = [];
                await targetUser.save();
            }
        )
        return res.status(HTTP_RESPONSE_CODE.FORBIDDEN).json({'success': false, msg: APP_ERROR_MESSAGE.forbiddenError, data: []});
    }

    // reissue a new refresh token
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {
            // got an expired token
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                await foundUser.save();
            }
            if (err || foundUser.username !== decoded.username) 
                return res.status(HTTP_RESPONSE_CODE.FORBIDDEN).json({'success': false, msg: APP_ERROR_MESSAGE.forbiddenError, data: []});
            // If refresh token was still valid
            const newAccessToken = genToken(foundUser._id, foundUser.username, process.env.JWT_A_TTL);
            const newRefreshToken = genToken(foundUser._id ,foundUser.username, process.env.JWT_R_TTL);
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            // create the cookie as well. TBC in production
            res.cookie('refresh_jwt', newRefreshToken, { httpOnly: true, maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10) });

            // Finalia, send a la refresha tokenita
            return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': APP_SUCCESS_MESSAGE.userAuthenticated, data: {
                'Access_token': newAccessToken
            } });
        }
    );
}

module.exports = { refreshTokenHandler };