const Users = require('../../models/users');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');

const RegistrationHandler = async (req, res) => {
    const { username, password, first_name, last_name } = req.body;
    console.log(req.body);
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required!' });
    try {
        const hashedPwd=  await bcrypt.hash(password, 10);
        const newUser = new Users ({
            first_name,
            last_name,
            username,
            password: hashedPwd,
        });
        const result = await newUser.save();
        console.log(result);
        res.status(201).json({ 'success': `New user ${username} successfully created!` });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

module.exports = { RegistrationHandler };