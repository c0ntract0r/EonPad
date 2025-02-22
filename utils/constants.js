module.exports = Object.freeze({
    RE_USER: /^[a-zA-Z][a-zA-Z0-9]*(?:_[a-zA-Z0-9]+)*$/,
    RE_PASSWORD: /^(?=.{8,24}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_+\-=\[\]{}\\|:;"'<,>.?/])(?=.*[0-9])./
})