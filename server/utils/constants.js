/* Thank you to olasunkanmi-SE for this idea */
const HTTP_RESPONSE_CODE = {
    OK: 200,
    NOT_FOUND: 404,
    CREATED: 201,
    CONFLICT: 409,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    BAD_REQUEST: 400
};


const APP_SUCCESS_MESSAGE = {
    objectFound: "found successfully",
    objectDeleted: "Object deleted successfully",
    objectCreated: "Object created successfully",
    createdUser: "User created successfully",
    userAuthenticated: "User Authenticated successfully",
}

const APP_ERROR_MESSAGE = {
    serverError: "Something went wrong, try again later",
    invalidCredentials: "Invalid username or password",
    unauthorized: "Operation not permitted.",
    noValidUser: "Sorry, User not found. May be permanently deleted",
    badRequest: "Request format is invalid: Field empty or does not meet requirements."
};
const REGULAR_EXPRESSIONS = Object.freeze({
    RE_NAME_SURNAME: /^[a-z ,.'-]+$/,
    RE_USER: /^[a-zA-Z][a-zA-Z0-9]*(?:_[a-zA-Z0-9]+)*$/,
    RE_PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_+\-=\[\]{}\\|:;"'<,>.?/])(?=.*[0-9])./
});




module.exports = { 
    REGULAR_EXPRESSIONS,
    HTTP_RESPONSE_CODE,
    APP_ERROR_MESSAGE,
    APP_SUCCESS_MESSAGE
 }