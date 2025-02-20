const jwt = require('jsonwebtoken');


const generateUserToken = (res,userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_USER_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('userjwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', 
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token;   
};

module.exports = generateUserToken