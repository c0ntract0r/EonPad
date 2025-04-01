// Helper function for Joi validation of registering

// currently works a bit like shit, this function should be corrected later
const JoiRegErrs = (fieldName, min, max) => {
    let retObject= {
        'string.empty': `${fieldName} cannot be empty`,
        ...(min ? { 'string.min': `Length of ${fieldName} should be at least ${min} characters` } : {}),
        ...(max ? { 'string.max': `Length of ${fieldName} should be at most ${max} characters` } : {}),
    }
    if (fieldName === 'First name' || fieldName === 'Last name') 
        // string.pattern.base - does match to the given regular expression
        Object.assign(retObject, {"string.pattern.base" : `${fieldName} can only have the following special characters: ,.'- and no numbers`})
    else if (fieldName === 'password')
        Object.assign(retObject, {"string.pattern.base": `${fieldName} should have at least 1 number, uppercase, lowercase, and any of the following characters: ~\`!@#$%^&*()_-+={[}]|:;"'<,>.?/`})
    else if (fieldName === 'username')
        Object.assign(retObject, {"string.pattern.base": `${fieldName} cannot start with number or special character, and cannot include whitespaces. 
                                                          Supported special character: _`})

    return retObject;
}

module.exports = JoiRegErrs;