const mongoose = require('mongoose');

// Product Schema
const productSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: ''
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
      type: String,
      default: ''
    },
    images: [{
      type: String,
    }],
    brand: [{
      type: String,
      default: ''
    }],
    price: [{
      type: Number,
      default: 0
    }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  });

// Define Model/Collection 
// With this export method you must import as obj { }
exports.Product = mongoose.model('Product', productSchema);
