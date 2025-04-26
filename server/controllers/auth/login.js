const Users = require('../../models/users');
const genToken = require('../../utils/tokenCreator');
const bcrypt = require('bcryptjs');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE } = require('../../utils/constants');

const loginHandler = async (req, res) => {
    const cookies = req.cookies;
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `${APP_ERROR_MESSAGE.badRequest} no username or password provided.` });
    }

    // attempt to find given user
    const user = await Users.findOne({ username });
    if (!user) { return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ 'success': false, 'msg': `${APP_ERROR_MESSAGE.invalidCredentials}` }) };
    const passCorrect = await bcrypt.compare(password, user.password);
    if (!passCorrect) {
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ 'success': false, 'msg': `${APP_ERROR_MESSAGE.invalidCredentials}` })
    }

    // pass in username & user_id as well, for creating JWT tokens
    const accessToken = genToken(user._id, user.username ,'a');
    const newRefreshToken = genToken(user._id, user.username, 'r');

    const newRefreshTokenArray =
        !cookies?.refresh_jwt
            ? user.refreshToken
            : user.refreshToken.filter(rt => rt !== cookies.jwt);
    
    // clear any existing refresh tokens. After frontend, need to check if can login from multiple places
    if (cookies?.refresh_jwt) res.clearCookie('refresh_jwt', newRefreshToken, { httpOnly: true });

    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await user.save();
    // send refresh cookie as HTTPOnly, so that can't be accessed with javascript
    res.cookie('refresh_jwt', newRefreshToken, { httpOnly: true, maxAge: 5*60*1000 });
    return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': APP_SUCCESS_MESSAGE.userAuthenticated, 'data': {
        username: user.username,
        user_token: {accessToken}
    } });

}



module.exports = { loginHandler };