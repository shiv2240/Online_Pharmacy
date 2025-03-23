const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
