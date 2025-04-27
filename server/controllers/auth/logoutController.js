const Users = require('../../models/users');
const { HTTP_RESPONSE_CODE, APP_SUCCESS_MESSAGE } = require('../../utils/constants');

const handleLogout = async (req, res) => {
    // on client, also delete the access 
    const cookies = req.cookies;
    if (!cookies?.refresh_jwt) return res.status(HTTP_RESPONSE_CODE.NO_CONTENT).json({ 'msg': 'No cookies' });
    const refreshToken = cookies.refresh_jwt;
    // is refresh token in database
    const foundUser = await Users.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('refresh_jwt', refreshToken, { httpOnly: true });
        return res.status(HTTP_RESPONSE_CODE.NO_CONTENT).json({ 'msg': 'No cookies' });
    }
    // Delete refresh token in database
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    await foundUser.save();

    res.clearCookie('refresh_jwt', refreshToken, { httpOnly: true });
    return res.status(HTTP_RESPONSE_CODE.NO_CONTENT).json({ 'success': true, 'msg': APP_SUCCESS_MESSAGE.userLogOut });
}

module.exports = { handleLogout };