const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// Get Users
router.get('/', async (req, res) => {
    const userList = await User.find()

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

// Add new User
router.post('/', async (req, res) => {
    // Creates new user with value from body applies it to schema
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin
    })
    // waits until user saves then returns a promise with the doc
    user = await user.save();
    // Checks if there is a user filled
    if(!user) 
    return res.status(404).send('The user cannot be created!')

    res.send(user)
})

// Delete User (Promise way)
router.delete('/:id', async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success: true, message: 'User was destroyed'})
        } else {
            return res.status(404).json({success: false, message: "User not found"})
        }
    }).catch(err => {
        // Connection error / wrong id
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;