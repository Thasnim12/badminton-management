const mongoose = require('mongoose');

const courtConfigSchema = mongoose.Schema({
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: true
    },
    defaultStartHour: {
        type: Number,
        default: 6 
    },
    defaultEndHour: {
        type: Number,
        default: 22 // 10 PM
    },
    defaultPrice: {
        type: Number,
    },
    closedDays: [{
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6]
    }]
}, {
    timestamps: true
});

const courtConfig = mongoose.model('courtConfig', courtConfigSchema);
module.exports = courtConfig
