const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Get all orders for a user
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.medicineId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/:userId', async (req, res) => {
  try {
    const { items, address, contactNumber, paymentMethod, cardDetails } = req.body;
    const newOrder = new Order({
      userId: req.params.userId,
      items,
      address,
      contactNumber,
      paymentMethod,
      cardDetails,
      status: 'processing',
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
