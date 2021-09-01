const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../models/product");
const { Category } = require("../models/category");

// Get Products asynchronously
// When productList gets called it waits to be filled then gets sent
router.get(`/`, async (req, res) => {
  // const productList = await Product.find().select('name image -_id');

  // array of categories entered by user
  let filter = {}
  if(req.query.categories) {
    // when there is a query sets category to query
    // splits array so that it returns a string
    filter = {category: req.query.categories.split(',')}
  }
  // finds all products in collection
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  //   sends response
  res.send(productList);
});

// Get one product
router.get(`/:id`, async (req, res) => {
  // Checks if its a valid ID
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID')
  }
  // finds product by id, populate() - any connected id or field to another table will be displayed
  // populating categories connected to product
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  //   sends response
  res.send(product);
});

// Post a new prodcut
router.post(`/`, async (req, res) => {
  // validate category has not already been created
  const category = await Category.findById(req.params.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = new Product({
    // Grabbing values and assiging to model
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  // Save to db asynchronously
  product = await product.save();

  if (!product)
    return res.status(500).send({ message: "Product cannot be created" });

  return res.send(product);
});

// Updating product
router.put("/:id", async (req, res) => { 
  // Checks if its a valid ID
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product ID')
  }
  // validate category has not already been created
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      // contains updated data
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    // Option to show updated doc
    { new: true }
  );

  if (!product)
    return res
      .status(500)
      .json({ success: false })
      .send("The product could not be updated");

  res.status(200).send(product);
});

// Delete product
router.delete('/:id', async (req, res) => {
  Product.findByIdAndRemove(req.params.id).then(product => {
      if(product) {
          return res.status(200).json({success: true, message: 'Product was destroyed'})
      } else {
          return res.status(404).json({success: false, message: "Product was not found"})
      }
  }).catch(err => {
      // Connection error / wrong id
      return res.status(400).json({success: false, error: err})
  })
})

// Get count of how many products in db
router.get(`/get/count`, async (req, res) => {
  // uses mongo method to get doc count and set doc count
  const productCount = await Product.countDocuments();

  if(!productCount) {
    res.status(500).json({success: false})
  } 
  res.send({
    productCount: productCount,
  });
})

// only gets a limited amount of featured products
router.get(`/get/featured/:count`, async (req, res) => {
  // sets default value to either param or 0 
  const count = req.params.count ? req.params.count : 0
  // gets only the products that have the correct paramater
  const featuredProducts = await Product.find({isFeatured: true}).limit(+count);

  if(!featuredProducts) {
    res.status(500).json({success: false})
  } 
  res.send(featuredProducts);
})

module.exports = router;
