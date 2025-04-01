// Regular expressions necessary to validate user registration process on front
export default Object.freeze({
    RE_NAME_SURNAME: /^[a-zA-Z ,.'-]+$/,
    RE_USER: /^[a-zA-Z][a-zA-Z0-9]*(?:_[a-zA-Z0-9]+)*$/,
    RE_PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_+\-=\[\]{}\\|:;"'<,>.?/])(?=.*[0-9])./
});