const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama kota harus diisi'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Deskripsi kota harus diisi'],
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('City', citySchema);