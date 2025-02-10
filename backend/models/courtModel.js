const mongoose = require('mongoose');

const courtSchema = mongoose.Schema({
    court_name: {
        type: String,
        required: true
    },
    court_image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Court = mongoose.model('Court', courtSchema);
module.exports = Court;