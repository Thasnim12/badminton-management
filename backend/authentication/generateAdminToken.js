const jwt = require('jsonwebtoken');


const generateAdminToken = (res,adminId) => {
    console.log('hey')
    const token = jwt.sign({ id: adminId }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('adminjwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return token;   
};

module.exports = generateAdminToken