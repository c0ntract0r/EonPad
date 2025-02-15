const Users = require('../../models/users');
const { StatusCodes } = require('http-status-codes');

const RegistrationHandler = async (req, res) => {
    console.log(req.body);
    // this is called spread syntax in JS
    const user = Users.create({...req.body});
    res.status(StatusCodes.CREATED).json({ user });
}

module.exports = { RegistrationHandler };