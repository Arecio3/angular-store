const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const multer = require("multer");

// List of acceptabele file extensions
const FILE_TYPE_MAP = {
  // defines file type (MIME type format)
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFile = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image file type");

    if (isValidFile) {
      uploadError = null;
    }
    // gets returned if theres an error uploading
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    // creates unique filename, replaces spaces with a -
    const fileName = file.originalname.replace(" ", "-");
    // assigns mimetype as extension
    const extension = FILE_TYPE_MAP[file.mimetype];
    // takes filename and adds '-dateCreated'
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// Get Products asynchronously
// When productList gets called it waits to be filled then gets sent
router.get(`/`, async (req, res) => {
  // const productList = await Product.find().select('name image -_id');

  // array of categories entered by user
  let filter = {};
  if (req.query.categories) {
    // when there is a query sets category to query
    // splits array so that it returns a string
    filter = { category: req.query.categories.split(",") };
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
    res.status(400).send("Invalid Product ID");
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
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  // validate category has not already been created
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("Invalid file");
  // grabs multer filename
  const fileName = file.filename;
  // backend url
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
  let product = new Product({
    name: req.body.name,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/uploads/filename"
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
    res.status(400).send("Invalid Product ID");
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
router.delete("/:id", async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "Product was destroyed" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product was not found" });
      }
    })
    .catch((err) => {
      // Connection error / wrong id
      return res.status(400).json({ success: false, error: err });
    });
});

// Get count of how many products in db
router.get(`/get/count`, async (req, res) => {
  // uses mongo method to get doc count and set doc count
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

// only gets a limited amount of featured products
router.get(`/get/featured/:count`, async (req, res) => {
  // sets default value to either param or 0
  const count = req.params.count ? req.params.count : 0;
  // gets only the products that have the correct paramater
  const featuredProducts = await Product.find({ isFeatured: true }).limit(
    +count
  );

  if (!featuredProducts) {
    res.status(500).json({ success: false });
  }
  res.send(featuredProducts);
});

// For posting multiple images
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    // Checks if its a valid ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid Product ID");
    }
    const files = req.files
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    if(files) {
      files.map((file) => {
        // maps over the files and pushes the filenames to the array
        imagesPaths.push(`${basePath}${file.fileName}`)
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        // contains updated data
        images: imagesPaths,
      },
      // Option to show updated doc
      { new: true }
    );
  }
);

module.exports = router;
