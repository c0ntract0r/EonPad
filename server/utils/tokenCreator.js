const jwt = require('jsonwebtoken');

// get user from request, and time according to needs. put a type to use(either a=access or r=refresh)
const genToken = (userID, user, expTime) => {

    const options = {
        issuer: "c0ntract0r software",
        subject: user,
        expiresIn: expTime,
    };

    return jwt.sign({"user_id": userID, "username": user}, process.env.JWT_SECRET, options);
}

module.exports = genToken;