const Users = require('../../models/users');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const constants = require('../../utils/constants');
const JoiRegErrs = require('../../utils/JoiRegErr');

// full registration handler if everything is alright
const RegistrationHandler = async (req, res) => {

    const regSchema = Joi.object({
        firstName: Joi.string().pattern(new RegExp(constants.RE_NAME_SURNAME, "i")).min(2).max(30).trim().required().messages(JoiRegErrs('First name', 2, 30)),
        lastName: Joi.string().pattern(new RegExp(constants.RE_NAME_SURNAME, "i")).min(2).max(45).trim().required().messages(JoiRegErrs('Last name', 2, 45)),
        userName: Joi.string().pattern(constants.RE_USER).min(4).max(34).trim().required().messages(JoiRegErrs('username', 4, 34)),
        pass: Joi.string().pattern(constants.RE_PASSWORD).min(8).max(24).trim().required().messages(JoiRegErrs('password', 8, 24)),
        confirmPassword: Joi.string().required().valid(Joi.ref("pass")).messages({
            "any.only": "Passwords must match",
            "string.empty": "Confirm password is required",
        }),
    });

    // Get all of the necessary data from request.body
    const { username, password, firstName, lastName, confirmPassword } = req.body;

    const { value, error } = regSchema.validate({ firstName: firstName, lastName: lastName, userName: username, pass: password, confirmPassword: confirmPassword  });

    if (error) {
        return res.status(400).json({error: error.details[0].message, errType: error.details[0].type});
    }

    console.log(value);

    try {
        const hashedPwd=  await bcrypt.hash(password, 10);
        const newUser = new Users ({
            first_name: firstName,
            last_name: lastName,
            username,
            password: hashedPwd,
        });
        const result = await newUser.save();
        res.status(201).json({ 'success': `New user ${username} successfully created!` });
    } catch (err) {
        // Separate handling. comes from mongoDB itself
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({
            error: `${field} ${err.keyValue[field]} is already taken. Try another username.`,
            errType: `string.conflict`
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