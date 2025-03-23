const express = require('express');
const Medicine = require('../models/Medicine');
const mongoose = require('mongoose')
const router = express.Router();

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new medicine
router.post('/', async (req, res) => {
  try {
    const { name, brand, price, stock } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });

    const newMedicine = new Medicine({ name, brand, price, stock });
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a medicine
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId before proceeding
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Medicine ID' });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a medicine
router.delete('/:id', async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!deletedMedicine) return res.status(404).json({ message: 'Medicine not found' });

    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
