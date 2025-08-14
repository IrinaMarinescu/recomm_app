const express = require('express');
const { body, validationResult } = require('express-validator');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');

const router = express.Router();

// Submit a new recommendation
router.post('/submit', [
  body('recommenderName').trim().notEmpty().withMessage('Recommender name is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('link').trim().isURL().withMessage('Valid URL is required'),
  body('description').optional().trim(),
  body('qrCodeId').trim().notEmpty().withMessage('QR Code ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { recommenderName, name, link, description, qrCodeId } = req.body;

    // Find the user by QR code ID
    const user = await User.findOne({ qrCodeId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found for this QR code'
      });
    }

    // Create the recommendation
    const recommendation = new Recommendation({
      recommenderName,
      name,
      link,
      description: description || '',
      submittedBy: user._id,
      qrCodeId
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Recommendation submitted successfully',
      recommendation: {
        id: recommendation._id,
        recommenderName: recommendation.recommenderName,
        name: recommendation.name,
        link: recommendation.link,
        description: recommendation.description,
        submittedAt: recommendation.submittedAt
      }
    });
  } catch (error) {
    console.error('Recommendation submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit recommendation'
    });
  }
});

// Get recommendations for a specific QR code
router.get('/user/:qrCodeId', async (req, res) => {
  try {
    const { qrCodeId } = req.params;

    // Verify the user exists
    const user = await User.findOne({ qrCodeId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recommendations for this QR code
    const recommendations = await Recommendation.find({ qrCodeId })
      .sort({ submittedAt: -1 })
      .select('-qrCodeId');

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      },
      recommendations
    });
  } catch (error) {
    console.error('Recommendation retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recommendations'
    });
  }
});

// Get user's own recommendations (protected route)
router.get('/my-recommendations', async (req, res) => {
  try {
    // This would typically use auth middleware, but for now we'll get user from query
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const recommendations = await Recommendation.find({ submittedBy: userId })
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('My recommendations retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recommendations'
    });
  }
});

module.exports = router; 