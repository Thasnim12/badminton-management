const mongoose = require('mongoose')

const slotSchema = mongoose.Schema({
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: true
    },
    date: {
        type: Date,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
    }
}, {
    timestamps: true
});

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
