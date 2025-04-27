const jwt = require('jsonwebtoken');

// get user from request, and time according to needs. put a type to use(either a=access or r=refresh)
const genToken = (userID, user, type='a') => {

    let timeExpire = null;

    if (type === 'a') {
        timeExpire = parseInt(process.env.JWT_A_TTL, 10) / 1000;
     }
    else if (type === 'r') {
        timeExpire = parseInt(process.env.JWT_R_TTL, 10) / 1000;
    }

    const options = {
        issuer: "c0ntract0r software",
        subject: user,
        expiresIn: timeExpire,
    };

    return jwt.sign({"user_id": userID, "username": user}, process.env.JWT_SECRET , options);
}

module.exports = genToken;