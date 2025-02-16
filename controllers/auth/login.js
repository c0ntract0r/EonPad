const Users = require('../../models/users');
const { StatusCodes } = require('http-status-codes');


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
    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({ msg: 'Authentication successful', usr: {
        user_name: user.username, user_token: token}})
}



module.exports = { loginHandler };