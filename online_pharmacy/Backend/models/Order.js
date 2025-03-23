const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Price per item
      },
    ],
    address: { type: String, required: true }, // Shipping address
    contactNumber: { type: String, required: true }, // Contact number
    paymentMethod: {
      type: String,
      enum: ['card', 'upi'],
      required: true,
    }, // Payment method (card or UPI)
    cardDetails: { type: String }, // Card details (only for card payments)
    status: { 
      type: String, 
      enum: ['processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'processing' 
    }, // Order status
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
