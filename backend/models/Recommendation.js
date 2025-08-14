const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  recommenderName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  qrCodeId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema); 