const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();

// Get Orders
router.get("/", async (req, res) => {
  // populate user table with only the name and sorts from newest to oldest
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

// Get one order
router.get("/:id", async (req, res) => {
  // populate user table with only the name and sorts from newest to oldest
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    // populate product info & category when order gets back
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

// Add Order
router.post("/", async (req, res) => {
  // for all orders in a cart it maps over all the current orderItems in table
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      // creates new orderItem with values
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      // Save to db
      newOrderItem = await newOrderItem.save();
      // only return ids
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  // Creates new model with value from body
  let order = new Order({
    // sets most current orderItems
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  // waits until order saves then returns a promise with the doc
  order = await order.save();
  // Checks if there is a category filled
  if (!order) return res.status(404).send("The order cannot be created!");

  res.send(order);
});

// Delete Order and OrderItems associated with order
router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        // after order deleted
        if(order) {
            // map over orderItems get every orderItem and delete
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

// Update Order
router.put("/:id", async (req, res) => {

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      // contains updated data
      status: req.body.status
    },
    // Option to show updated doc
    { new: true }
  );

  if (!order) return res.status(400).send('The order was not found');

  res.status(200).send(order);
});

module.exports = router;
