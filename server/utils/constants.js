/* Thank you to olasunkanmi-SE for this idea */
const HTTP_RESPONSE_CODE = {
    OK: 200,
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
};


const APP_SUCCESS_MESSAGE = {
    objectFound: "found successfully",
    objectDeleted: "deleted successfully",
    objectCreated: "created successfully",
    userAuthenticated: "User Authenticated successfully",
    userLogOut: "User Logged out successfully"
}

const APP_ERROR_MESSAGE = {
    serverError: "Something went wrong, try again later",
    invalidCredentials: "Invalid username or password.",
    unauthorized: "Operation not permitted.",
    noValidUser: "Sorry, User not found. May be permanently deleted",
    badRequest: "Request is invalid: ",
    notFound: "Not found. Please try again",
    conflictError: "already exists. Please try another",
    forbiddenError: "Can't access resource. Operation forbidden."
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