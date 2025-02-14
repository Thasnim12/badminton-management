const mongoose = require('mongoose')

const rentalSchema = mongoose.Schema({
    addon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addons',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    },
    quantity: {
        type: Number,
    },
    rentelTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Active', 'Returned', 'Overdue'],
        default: 'Active'
    },
    actualReturnDate: {
        type: Date
    }
},{ timestamps: true })

const Rental = mongoose.model('Rental',rentalSchema)
module.exports = Rental;