const jwt = require('jsonwebtoken');

const generateAdminToken = (res,adminId) => {

    if (!process.env.JWT_ADMIN_SECRET) {
        console.error('JWT_ADMIN_SECRET is missing!');
        return;
    }
    
    const token = jwt.sign({ id: adminId }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: '30d',
    });

    console.log(token,'token')

    res.cookie('adminjwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', 
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token;   
};

module.exports = generateAdminToken