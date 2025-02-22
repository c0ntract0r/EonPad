const Users = require('../../models/users');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const constants = require('../../utils/constants');


// to return back to login page, after registration with a message.
const RegistrationHandler = async (req, res) => {
    const { username, password, first_name, last_name } = req.body;
    console.log(req.body);
    if (password.length < 8 || password.length > 24) return res.status(400).json({'msg': 'Password must be between 8 and 24 characters long'});
    else if (!constants.RE_PASSWORD.test(password)) return res.status(400).json({'msg': 'Password should contain at least 1 uppercase, lowecase, number and a special character.'})
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
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({
            error: `${field} ${err.keyValue[field]} is already taken. Try another username.`
        });
    }
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({
                status: 'error',
                errors
            });
        }
        return res.sendStatus(500);
    }
}

module.exports = { RegistrationHandler };