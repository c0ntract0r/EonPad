/* Thank you to olasunkanmi-SE for this idea */
const HTTP_RESPONSE_CODE = {
    NOT_FOUND: 404,
    CREATED: 201,
    CONFLICT: 409,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    BAD_REQUEST: 400
};
const APP_ERROR_MESSAGE = {
    serverError: "Something went wrong, try again later",
    createdUser: "User created successfully",
    objectCreated: "Object created successfully",
    userAuthenticated: "User Authenticated successfully",
    invalidCredentials: "Invalid username or password",
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
    APP_ERROR_MESSAGE
 }