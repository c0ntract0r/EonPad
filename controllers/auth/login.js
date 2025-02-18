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
    console.log(user);
    const accessToken = genToken(user.username, 'a');
    const refreshToken = genToken(user.username, 'r');
    const expirationDate = Date.now() + 150000;

    console.log(expirationDate);
    await Users.updateOne(
        {_id: user._id},
        {
            $push: {
                refreshTokenDocs: {
                    token: refreshToken,
                    expirationDate: new Date(expirationDate)
                }
            }
        }
    );
    return res.status(StatusCodes.OK).json({ msg: 'Authentication successful', usr: {
        user_name: user.username, user_token: {accessToken, refreshToken}}})
}



module.exports = { loginHandler };