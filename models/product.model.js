const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,  
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        require: true
    },
    inStock: {
        type: Number,
        require: true,
        default: 1
    },
    image: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);