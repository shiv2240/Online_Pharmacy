const express = require('express');
const Order = require('../models/Order'); // Import Order model
const Cart = require('../models/Cart'); // Import Cart model
const router = express.Router();

// POST request for handling payment
router.post('/', async (req, res) => {
  try {
    // Get cartItems from request body
    const { cartItems } = req.body;

    // Check if cartItems is provided and has content
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Log the incoming cartItems for debugging
    console.log('Received cartItems:', cartItems);

    // Extract userId from the first item (adjust if necessary)
    const userId = cartItems[0].userId;

    // If userId is missing, return an error
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    // Map cartItems to order items format
    const items = cartItems.map(item => ({
      medicineId: item.medicineId._id, // Assuming medicineId is an object, use the _id
      quantity: item.quantity,
      price: item.medicineId.price,  // Assuming price is nested within medicineId
    }));

    // Log the prepared order items for debugging
    console.log('Order items:', items);

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      address: req.body.address || 'Default Address',  // Get address from request body or set default
      contactNumber: req.body.contactNumber || 'Default Contact',  // Get contact from request body or set default
      paymentMethod: req.body.paymentMethod || 'card',  // Payment method can be passed in the request
      cardDetails: req.body.cardDetails || '**** **** **** 1234',  // Masked card number or pass actual details if required
      status: 'processing',  // Order status initially set to processing
    });

    // Save the order to the database
    await newOrder.save();

    // Log the created order for debugging
    console.log('Order saved:', newOrder);

    // Clear the user's cart after successful order creation
    await Cart.deleteMany({ userId });

    // Respond with success and the new order's ID
    res.status(200).json({
      message: 'Payment successful',
      orderId: newOrder._id,  // Return the newly created order's ID
    });

  } catch (error) {
    // Log detailed error for debugging
    console.error('Payment processing error:', error.message || error);
    console.error('Error stack:', error.stack);

    // Respond with an error message
    res.status(500).json({ message: 'Payment Success' });
  }
});

module.exports = router;
