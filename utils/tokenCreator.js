const jwt = require('jsonwebtoken');
require('dotenv').config();

// get user from request, and time according to needs. put a type to use(either a=access or r=refresh)
const genToken = (user, type='a') => {
    
    let secret_key = null;
    let timeExpire = null;

    if (type === 'a') { 
        secret_key = process.env.JWT_ACCESS_SECRET;
        timeExpire = process.env.JWT_A_TTL;
     }
    else if (type === 'r') { 
        secret_key = process.env.JWT_REFRESH_SECRET;
        timeExpire = process.env.JWT_R_TTL;
    }

    const options = {
        issuer: "c0ntract0r software",
        subject: user,
        expiresIn: parseInt(timeExpire),
    };
    
    return jwt.sign({ "username": user }, secret_key , options);
}

module.exports = genToken;