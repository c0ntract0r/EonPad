const Users = require('../../models/users');
const { StatusCodes } = require('http-status-codes');
const genToken = require('../../utils/tokenCreator');
require('dotenv').config();

const loginHandler = async (req, res) => {
    const cookies = req.cookies;
    const { username, password } = req.body;
    if (!username || !password) {
        return res.send('Please send valid username and password!');
    }
    const user = await Users.findOne({ username });
    if (!user) { return res.status(StatusCodes.FORBIDDEN).json({ msg: 'Forbidden!' }) };
    const passCorrect = await user.comparePassword(password);
    console.log(passCorrect);
    if (!passCorrect) {
        // right, this is for debugging for now
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Incorrect password!' });
    }
    const accessToken = genToken(user.username, 'a');
    const newRefreshToken = genToken(user.username, 'r');

    console.log(`This is the access token: ${accessToken}`);
    console.log(`This is the refresh token: ${newRefreshToken}`);

    const newRefreshTokenArray =
        !cookies?.refresh_jwt
            ? user.refreshToken
            : user.refreshToken.filter(rt => rt !== cookies.jwt);
    
    if (cookies?.refresh_jwt) res.clearCookie('refresh_jwt', newRefreshToken, { httpOnly: true });

    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await user.save();
    // send refresh cookie as HTTPOnly - may expect date. TO BE FIXED IN PRODUCTION
    res.cookie('refresh_jwt', newRefreshToken, { httpOnly: true, maxAge: 5*60*1000 });
    return res.status(StatusCodes.OK).json({ msg: 'Authentication successful', usr: {
                user_name: user.username, user_token: {accessToken}}})
}



module.exports = { loginHandler };