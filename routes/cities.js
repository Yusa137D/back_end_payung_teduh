const express = require('express');
const router = express.Router();
const City = require('../models/City');

// @route   GET /api/cities
// @desc    Mengambil semua data kota
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      data: cities,
      message: 'Berhasil mengambil data kota'
    });
  } catch (error) {
    console.error('Error getting cities:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kota'
    });
  }
});

// @route   POST /api/cities
// @desc    Menambah kota baru
// @access  Private (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    // Validasi input
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan deskripsi kota harus diisi'
      });
    }

    // Cek apakah kota sudah ada
    const existingCity = await City.findOne({ name });
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'Kota sudah terdaftar'
      });
    }

    // Buat kota baru
    const city = await City.create({
      name,
      description,
      imageUrl
    });

    res.status(201).json({
      success: true,
      data: city,
      message: 'Kota berhasil ditambahkan'
    });
  } catch (error) {
    console.error('Error adding city:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambah kota'
    });
  }
});

// @route   PUT /api/cities/:id
// @desc    Mengupdate data kota
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    // Validasi input
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan deskripsi kota harus diisi'
      });
    }

    // Cek apakah nama kota yang baru sudah ada (kecuali untuk kota yang sedang diupdate)
    const existingCity = await City.findOne({ 
      name, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'Nama kota sudah digunakan'
      });
    }

    // Update kota
    const city = await City.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Kota tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: city,
      message: 'Kota berhasil diupdate'
    });
  } catch (error) {
    console.error('Error updating city:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kota'
    });
  }
});

// @route   DELETE /api/cities/:id
// @desc    Menghapus kota
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Kota tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Kota berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kota'
    });
  }
});

module.exports = router;