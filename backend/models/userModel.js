const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        unique: true,  
    },
    password: {
        type: String,
    },
    phoneno: {
        type: String,
    },
    profileImage: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
