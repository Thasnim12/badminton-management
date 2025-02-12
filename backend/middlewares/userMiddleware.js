
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.userjwt;
        console.log('Cookies received:', req.cookies);
        
        if (!token) {
            console.log('No token in cookies');
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            console.log('User not found for id:', decoded.id);
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticateUser;
