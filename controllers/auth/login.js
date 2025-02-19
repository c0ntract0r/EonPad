const Users = require('../../models/users');
const { StatusCodes } = require('http-status-codes');
const genToken = require('../../utils/tokenCreator');
require('dotenv').config();

const loginHandler = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.send('Please send valid username and password!');
    }
    const user = await Users.findOne({ username });
    if (!user) { return res.status(StatusCodes.FORBIDDEN).json({ msg: 'Forbidden!' }) };
    const passCorrect = await user.comparePassword(password);
    if (!passCorrect) {
        // right, this is for debugging for now
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Incorrect password!' });
    }
    const accessToken = genToken(user.username, 'a');
    const refreshToken = genToken(user.username, 'r');
    const expirationDate = Date.now() + parseInt(process.env.JWT_R_TTL);
    await Users.updateOne(
        {
            $push: {
                refreshTokenDocs: {
                    token: refreshToken,
                    expirationDate: new Date(expirationDate)
                }
            }
        }
    );
    // send refresh cookie as HTTPOnly - may expect date
    res.cookie('refresh_jwt', refreshToken, { httpOnly: true, maxAge: 5*60*1000 });
    return res.status(StatusCodes.OK).json({ msg: 'Authentication successful', usr: {
                user_name: user.username, user_token: {accessToken, refreshToken}}})
}



module.exports = { loginHandler };