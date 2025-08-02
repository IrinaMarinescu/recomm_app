const express = require('express');
const QRCodeService = require('../services/qrCodeService');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate QR code for the authenticated user
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await QRCodeService.generateUserQRCode(req.user._id);
    const qrCodeImage = await QRCodeService.generateQRCodeImage(user.qrCodeData);
    
    res.json({
      success: true,
      qrCodeImage,
      qrCodeData: user.qrCodeData,
      generatedAt: user.qrCodeGeneratedAt
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate QR code' 
    });
  }
});

// Get QR code image for the authenticated user
router.get('/image', auth, async (req, res) => {
  try {
    const qrCodeImage = await QRCodeService.getUserQRCodeImage(req.user._id);
    
    res.json({
      success: true,
      qrCodeImage
    });
  } catch (error) {
    console.error('QR code retrieval error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve QR code' 
    });
  }
});

// Get QR code data for the authenticated user
router.get('/data', auth, async (req, res) => {
  try {
    const user = await QRCodeService.generateUserQRCode(req.user._id);
    
    res.json({
      success: true,
      qrCodeData: user.qrCodeData,
      qrCodeId: user.qrCodeId,
      generatedAt: user.qrCodeGeneratedAt
    });
  } catch (error) {
    console.error('QR code data retrieval error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve QR code data' 
    });
  }
});

// Decode QR code data (public endpoint for scanning)
router.post('/decode', async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ 
        success: false, 
        message: 'QR code data is required' 
      });
    }

    if (!QRCodeService.validateQRCodeData(qrData)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid QR code data' 
      });
    }

    const decodedData = QRCodeService.decodeQRCodeData(qrData);
    
    res.json({
      success: true,
      decodedData
    });
  } catch (error) {
    console.error('QR code decode error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to decode QR code' 
    });
  }
});

// Get user info by QR code ID for recommendation form (public endpoint)
router.get('/user/:qrCodeId', async (req, res) => {
  try {
    const { qrCodeId } = req.params;
    
    const User = require('../models/User');
    const user = await User.findOne({ qrCodeId }).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        qrCodeId: user.qrCodeId
      }
    });
  } catch (error) {
    console.error('QR code user retrieval error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve user info' 
    });
  }
});

module.exports = router; 