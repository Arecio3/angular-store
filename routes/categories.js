const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// Get Categories
router.get('/', async (req, res) => {
    const categoryList = await Category.find()

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

// Get one category
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category was not found'})
    }
    res.status(200).send(category);
})

// Add Categories
router.post('/', async (req, res) => {
    // Creates new model with value from body
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    // waits until category saves then returns a promise with the doc
    category = await category.save();
    // Checks if there is a category filled
    if(!category) 
    return res.status(404).send('The category cannot be created!')

    res.send(category)
})

// Delete Category (Promise way)
router.delete('/:id', async (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(200).json({success: true, message: 'Category was destroyed'})
        } else {
            return res.status(404).json({success: false, message: "Category not found"})
        }
    }).catch(err => {
        // Connection error / wrong id
        return res.status(400).json({success: false, error: err})
    })
})

// Update Category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            // contains updated data
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        // Option to show updated doc
        { new: true }
    )

    if(!category) 
    return res.status(500).json({success: false})

    res.status(200).send(category);
})

module.exports = router;