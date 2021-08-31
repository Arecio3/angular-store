const mongoose = require('mongoose');
const Category = require('./category');

// Product Schema
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    },
    description: String,
    richDescription: String,
    images: String,
    brand: String,
    price: Number,
    rating: Number,
    isFeatured: Boolean,
    dateCreated: Date
  });

// Define Model/Collection 
exports.Product = mongoose.model('Product', productSchema);
