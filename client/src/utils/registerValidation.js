import { object, string, date, ref } from 'yup';
import constants from './constants';

// define error messages here, hopefully cluttering things less
const errorMessages = {
    firstLastName: [ 'cannot be empty',
                'should be at most 35 characters long', 
                'only letters, spaces, hyphens(-), apostrophes(\'), dots(.) and hyphens(-) allowed'],
    username: [ 'Username cannot be empty',
                'Username must be between 4 and 24 characters long.',
                'Username can contain only letters, numbers and underscores'],
    password: [ 'Password cannot be empty',
                'Password must be between 8 to 32 characters long',
                'Password must contain at least one uppercase, lowercase, numeric and one (~!@#$%^&*()_+-={}\|:;"\'<,>.?/) special character'
     ],
     confirmPassword: [
        'Password confirmation is required',
        'Passwords do not match'
     ]
}

// user schema: Validate data on front-side for client to see
let userSchema = object({
    firstName: string()
               .required(`First name ${errorMessages.firstLastName[0]}`)
               .max(35, `${errorMessages.firstLastName[1]}`)
               .matches(constants.RE_NAME_SURNAME, `${errorMessages.firstLastName[2]}`),
    lastName: string()
               .required(`Last name ${errorMessages.firstLastName[0]}`)
               .max(35, `Last name ${errorMessages.firstLastName[1]}`)
               .matches(constants.RE_NAME_SURNAME, `${errorMessages.firstLastName[2]}`),
    username: string()
              .required(errorMessages.username[0])
              .min(4, errorMessages.username[1])
              .max(24, errorMessages.username[1])
              .matches(constants.RE_USER, errorMessages.username[2]),
    password: string()
              .required(errorMessages.password[0])
              .min(8, errorMessages.password[1])
              .max(32, errorMessages.password[1])
              .matches(constants.RE_PASSWORD, errorMessages.password[2]),
    confirmPassword: string()
              .oneOf([ref('password'), null], errorMessages.confirmPassword[1])
    });

export default userSchema;