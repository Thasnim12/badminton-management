const mongoose = require('mongoose')

const addonSchema = new mongoose.Schema({
    item_name: {
        type: String,
    },
    item_type: {
        type: [String],
        enum: ["For Sale", "For Rent"],
        required: true
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    item_image: {
        type: String
    },
}, { timestamps: true })

const Addons = mongoose.model('Addons', addonSchema)
module.exports = Addons