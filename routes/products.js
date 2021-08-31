const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get Products asynchronously
// When productList gets called it waits to be filled then gets sent
router.get(`/`, async (req, res) => {
    // finds all products in model
    const productList = await Product.find();
  
    if(!productList) {
        res.status(500).json({success: false})
    }
  //   sends response
    res.send(productList);
  });
  
  // Post a new prodcut
  router.post(`/`, (req, res) => {
    const product = new Product({
      // Grabbing values and assiging to model
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
    });
    // Save to db returns promise with doc
  //   Alternative to async method call
    product
      .save()
      .then((createdProduct) => {
        res.status(201).json(createdProduct);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          // allows to cut loading incase of failure
          success: false,
        });
      });
  });

  module.exports = router