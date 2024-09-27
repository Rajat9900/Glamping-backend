const mongoose = require("mongoose")

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
       
    },
    description: {
        type: String
    },
    rating: {
        type: Number
    },
    rate: {
        type: Number
    },
    perDayNight: {
        type: String
    },
    star: {
type: String
    },createdAt:
    {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Hotel" , ProductsSchema)
