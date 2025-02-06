const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();


const generateAdminToken = (res,adminId) => {
    const token = jwt.sign({ id: adminId }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('adminjwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return token;   
};

module.exports = generateAdminToken