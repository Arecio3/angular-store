const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const router = express.Router();

// Get Orders
router.get('/', async (req, res) => {
    const orderList = await Order.find()

    if(!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

// Add Order
router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        // maps over and creates new orderItem with values
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        // Save to db
        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;
    // Creates new model with value from body
    let order = new Order({
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
    })
    // waits until order saves then returns a promise with the doc
    order = await order.save();
    // Checks if there is a category filled
    if(!order)
    return res.status(404).send('The order cannot be created!')

    res.send(order)
})


// Delete Order (Promise way)
router.delete('/:id', async (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(order => {
        if(order) {
            return res.status(200).json({success: true, message: 'Order was destroyed'})
        } else {
            return res.status(404).json({success: false, message: "Order not found"})
        }
    }).catch(err => {
        // Connection error / wrong id
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;