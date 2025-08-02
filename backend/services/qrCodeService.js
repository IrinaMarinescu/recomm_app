const QRCode = require('qrcode');
const User = require('../models/User');

class QRCodeService {
  /**
   * Generate QR code data for a user
   * @param {Object} user - User object
   * @returns {Object} QR code data
   */
  static generateQRCodeData(user) {
    const qrData = {
      userId: user._id.toString(),
      qrCodeId: user.qrCodeId,
      name: user.name,
      email: user.email,
      timestamp: new Date().toISOString(),
      type: 'recommendation_form'
    };
    
    return JSON.stringify(qrData);
  }

  /**
   * Generate QR code image as data URL
   * @param {string} data - Data to encode in QR code
   * @returns {Promise<string>} Data URL of the QR code image
   */
  static async generateQRCodeImage(data) {
    try {
      const options = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      };
      
      const dataUrl = await QRCode.toDataURL(data, options);
      return dataUrl;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  /**
   * Generate and save QR code for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user with QR code data
   */
  static async generateUserQRCode(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate QR code data
      const qrData = this.generateQRCodeData(user);
      
      // Update user with QR code data
      user.qrCodeData = qrData;
      user.qrCodeGeneratedAt = new Date();
      
      await user.save();
      
      return user;
    } catch (error) {
      throw new Error(`Failed to generate user QR code: ${error.message}`);
    }
  }

  /**
   * Get QR code image for a user
   * @param {string} userId - User ID
   * @returns {Promise<string>} Data URL of the QR code image
   */
  static async getUserQRCodeImage(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate QR code if it doesn't exist
      if (!user.qrCodeData) {
        await this.generateUserQRCode(userId);
        // Fetch updated user
        const updatedUser = await User.findById(userId);
        return await this.generateQRCodeImage(updatedUser.qrCodeData);
      }

      return await this.generateQRCodeImage(user.qrCodeData);
    } catch (error) {
      throw new Error(`Failed to get user QR code image: ${error.message}`);
    }
  }

  /**
   * Decode QR code data
   * @param {string} qrData - QR code data string
   * @returns {Object} Decoded data
   */
  static decodeQRCodeData(qrData) {
    try {
      return JSON.parse(qrData);
    } catch (error) {
      throw new Error('Invalid QR code data format');
    }
  }

  /**
   * Validate QR code data
   * @param {string} qrData - QR code data string
   * @returns {boolean} True if valid
   */
  static validateQRCodeData(qrData) {
    try {
      const decoded = this.decodeQRCodeData(qrData);
      return decoded && decoded.userId && decoded.qrCodeId && decoded.type === 'recommendation_form';
    } catch (error) {
      return false;
    }
  }
}

module.exports = QRCodeService; 