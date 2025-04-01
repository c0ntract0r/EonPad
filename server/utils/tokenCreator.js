const jwt = require('jsonwebtoken');
require('dotenv').config();

// get user from request, and time according to needs. put a type to use(either a=access or r=refresh)
const genToken = (userID, user, type='a') => {

    let timeExpire = null;

    if (type === 'a') { 
        timeExpire = process.env.JWT_A_TTL;
     }
    else if (type === 'r') { 
        timeExpire = process.env.JWT_R_TTL;
    }

    const options = {
        issuer: "c0ntract0r software",
        subject: user,
        expiresIn: eval(timeExpire),
    };

    return jwt.sign({ "user_id": userID }, process.env.JWT_SECRET , options);
}

module.exports = genToken;