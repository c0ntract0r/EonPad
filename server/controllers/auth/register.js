const Users = require('../../models/users');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE, REGULAR_EXPRESSIONS } = require('../../utils/constants');
const JoiRegErrs = require('../../utils/JoiRegErr');

const regSchema = Joi.object({
    firstName: Joi.string().pattern(new RegExp(REGULAR_EXPRESSIONS.RE_NAME_SURNAME, "i")).min(2).max(30).trim().required().messages(JoiRegErrs('First name', 2, 30)),
    lastName: Joi.string().pattern(new RegExp(REGULAR_EXPRESSIONS.RE_NAME_SURNAME, "i")).min(2).max(45).trim().required().messages(JoiRegErrs('Last name', 2, 45)),
    userName: Joi.string().pattern(REGULAR_EXPRESSIONS.RE_USER).min(4).max(34).trim().required().messages(JoiRegErrs('username', 4, 34)),
    pass: Joi.string().pattern(REGULAR_EXPRESSIONS.RE_PASSWORD).min(8).max(24).trim().required().messages(JoiRegErrs('password', 8, 24)),
    confirmPassword: Joi.string().required().valid(Joi.ref("pass")).messages({
        "any.only": "Passwords must match",
        "string.empty": "Confirm password is required",
    }),
});


const RegistrationHandler = async (req, res) => {

    const { username, password, firstName, lastName, confirmPassword } = req.body;

     // Validate Every object, and only then create a new User
    const { value, error } = regSchema.validate({ firstName: firstName, lastName: lastName, userName: username, pass: password, confirmPassword: confirmPassword  });

    if (error) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': {
            'errorType': error.details[0].type,
            'error': `${APP_ERROR_MESSAGE.badRequest} ${error.details[0].message}`
        } });
    }

    // if user request is in valid form
    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = new Users ({
            first_name: firstName,
            last_name: lastName,
            username,
            password: hashedPwd,
        });

        await newUser.save();

        return res.status(HTTP_RESPONSE_CODE.CREATED).json({ 'success': true, msg: `New User ${username} ${APP_SUCCESS_MESSAGE.objectCreated}` });

    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];

        return res.status(HTTP_RESPONSE_CODE.CONFLICT).json({
            'success': false, 'msg':
                {
                    'errType': 'string.conflict',
                    'error': `${field} ${err.keyValue[field]} is already taken. Try another username.`
                }
        });
    }
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                'success': false,
                'msg': `Error encountered: ${errors}`,
                errors
            });
        }
        return res.sendStatus(HTTP_RESPONSE_CODE.SERVER_ERROR);
    }
}

module.exports = { RegistrationHandler };