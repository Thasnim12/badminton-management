const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: [String],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: [Number],  
        default: []
    }
}, { timestamps: true })

const Banner = mongoose.model('Banner', bannerSchema)
module.exports = Banner;