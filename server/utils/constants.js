/*
    RE_NAME_SURNAME: Ensure that name and surname only contain case-insensitive letters, spaces, commas, apostrophes, or hyphens
    RE_USER: Ensure, that username first char should be upper/lowercase, after that, any combination of letters and numbers is allowed,
             and also _ is allowed as a username. I MAY CONSIDER USERNAME and first and last name limitations silly, but who knows
    RE_PASSWORD: Ensure, that the password has at least 1 uppercase, lowercase, special, and number characters
*/

module.exports = Object.freeze({
    RE_NAME_SURNAME: /^[a-z ,.'-]+$/,
    RE_USER: /^[a-zA-Z][a-zA-Z0-9]*(?:_[a-zA-Z0-9]+)*$/,
    RE_PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_+\-=\[\]{}\\|:;"'<,>.?/])(?=.*[0-9])./
})