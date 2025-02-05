
const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')


const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.adminjwt;
    console.log(token,'tok')

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
            const admin = await Admin.findById(decoded.id).select('-password');
            if (admin) {
                req.admin = admin;
                next();
            } else {
                res.status(401).json({ message: 'Admin not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
};

module.exports = authenticateAdmin;
