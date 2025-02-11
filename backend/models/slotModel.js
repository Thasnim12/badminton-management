const mongoose = require('mongoose')

const slotSchema = mongoose.Schema({
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
