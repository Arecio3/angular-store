const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get Users
router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// Get one User
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ message: "The user was not found" });
  }
  res.status(200).send(user);
});

// Add new User
router.post("/", async (req, res) => {
  // Creates new user with value from body applies it to schema
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    isAdmin: req.body.isAdmin,
  });
  // waits until user saves then returns a promise with the doc
  user = await user.save();
  // Checks if there is a user filled
  if (!user) return res.status(404).send("The user cannot be created!");

  res.send(user);
});

// Delete User (Promise way)
router.delete("/:id", async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "User was destroyed" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      // Connection error / wrong id
      return res.status(400).json({ success: false, error: err });
    });
});

// Update User
router.put("/:id", async (req, res) => {
    // Checks db if password exist
  const userExist = await User.findById(req.params.id);

  if (req.body.password) {
    // If there is a value in the body set that to newPassword
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    //   If there isn't use old password
      newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      // contains updated data
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
    },
    // Option to show updated doc
    { new: true }
  );

  if (!user) return res.status(500).json({ success: false });

  res.status(200).send(user);
});

// Login
router.post('/login', async (req, res) => {
    // Checks if the email is valid
    const user = await User.findOne({email: req.body.email,})

    const secret = process.env.secret;

    if(!user){
        return res.status(400).send("The User was not found")
    }
    // If theres a User and password passed in matches hash password
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        // Generate JWT
        const token = jwt.sign(
            {   
                // You can pass data into token
                userId: user.id,
                isAdmin: user.isAdmin                
            },
            // Secret (Password used to create token)
            secret,
            // Sets when the token should expire
            {expiresIn: '1d'}
        )
        // Send email and token to frontend to access API
        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('Wrong Password')
    }

    return res.status(200).send(user)
})

// Register
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })

    user = await user.save();
    if(!user)
        return res.status(400).send("The User was not found")
    
        res.status(200).send(user)
})

// Get count of how many users in db
router.get(`/get/count`, async (req, res) => {
    // uses mongo method to get doc count and set doc count
    const userCount = await User.countDocuments();
  
    if(!userCount) {
      res.status(500).json({success: false})
    } 
    res.send({
      userCount: userCount,
    });
  })

module.exports = router;
