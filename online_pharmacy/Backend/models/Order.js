const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
