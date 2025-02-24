
const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')


const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.adminjwt;
        console.log(token,'token')
        console.log('Cookies received:', req.cookies.adminjwt);
        
        if (!token) {
            console.log('No token in cookies');
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin) {
            console.log('Admin not found for id:', decoded.id);
            return res.status(401).json({ message: 'Admin not found' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticateAdmin;
