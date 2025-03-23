const express = require('express');
const Cart = require('../models/Cart'); // Importing Cart model
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get cart items for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching cart for user:", userId);

    const cart = await Cart.findOne({ userId }).populate('items.medicineId');
    
    console.log("Cart found:", JSON.stringify(cart, null, 2)); // ✅ Log full cart
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: error.message });
  }
});


// Add an item to the cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ medicineId, quantity });
    }

    // Force MongoDB to return updated cart
    const updatedCart = await cart.save();
    const populatedCart = await Cart.findById(updatedCart._id).populate('items.medicineId');

    res.status(201).json(populatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: error.message });
  }
});

// Remove an item from the cart
router.delete('/:medicineId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.medicineId.toString() !== req.params.medicineId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear the entire cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
