// routes/charge.js
const express = require('express');
const Order = require('../models/Order'); // Import Order model
const Cart = require('../models/Cart'); // Import Cart model
const router = express.Router();

// POST request for handling payment
router.post('/', async (req, res) => {
  try {
    const { cartItems } = req.body;

    // Simulate payment success
    console.log('Processing payment for items:', cartItems);

    // Get userId from the cartItems or authenticate user using JWT token
    const userId = cartItems[0].userId; // Assuming cartItems includes userId. Adjust as needed.

    // Now create an order in the database
    const items = cartItems.map(item => ({
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: item.medicineId.price,
    }));

    const newOrder = new Order({
      userId,
      items,
      address: 'Some address', // You can add this to the request body from frontend
      contactNumber: 'Some contact', // Same as above
      paymentMethod: 'card', // Or UPI, based on your payment method
      cardDetails: '**** **** **** 1234', // Or any other details needed
      status: 'processing',
    });

    await newOrder.save();

    // Clear the cart for this user (assuming Cart model has a userId)
    await Cart.deleteMany({ userId }); // Clear cart items from the Cart collection

    // Return the order ID
    res.status(200).json({
      message: 'Payment successful',
      orderId: newOrder._id, // Send the order ID back
    });
} catch (error) {
    console.error('Payment error:', error.message);  // Log the error message
    console.error(error.stack);  // Log the stack trace
    res.status(500).json({ message: 'Payment failed. Please try again.' });
}

});

module.exports = router;
