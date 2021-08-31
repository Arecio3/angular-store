const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

const api = process.env.API_URL;

// Middleware (Tells express to parse JSON)
app.use(express.json());
app.use(morgan('tiny'));

// Get Products
app.get(`${api}/products`, (req, res) => {
    // response
    const product = {
        id: 1,
        name: 'PlayStation 5',
        image: 'some url'
    }
    res.send(product);
})

// Post a new prodcut
app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body
    console.log(newProduct)
    res.send(newProduct);
})

// Connection to db
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
.then(() => {
    console.log('Database connection is ready')
})
.catch((err) => {
    console.log(`Whoops found this error: ${err}`)
})

// telling express to listen to port 3000
app.listen(3000, () => {
    console.log('Backend server running at http://localhost:3000')
})