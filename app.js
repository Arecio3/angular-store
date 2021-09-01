const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');
// enables cors (allows any app to request API from my server)
app.use(cors());
// "*" allows all other http request to be passed from any other origin
app.options('*', cors())

//-- MIDDLEWARE--
// Checking everything going into the server before executed
// Tells express to parse JSON
app.use(express.json());
// Tells express to use morgan
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

// Routes
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');

const api = process.env.API_URL;
// Connecting Routes
app.use(`${api}/products`, productsRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/orders`, ordersRoute);
// --------------


// Connection to db
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database',
  })
  .then(() => {
    console.log('Database connection is ready');
  })
  .catch((err) => {
    console.log(`Whoops found this error: ${err}`);
  });


// telling express to listen to port 3000
app.listen(3000, () => {
  console.log('Backend server running at http://localhost:3000');
});
