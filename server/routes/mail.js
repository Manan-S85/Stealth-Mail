const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const MailService = require('../services/mailService');

const router = express.Router();
const mailService = new MailService();

/**
 * @route   POST /api/mail/create
 * @desc    Create a new temporary email address
 * @access  Public
 */
router.post('/create', asyncHandler(async (req, res) => {
  console.log('📧 Creating new temporary email...');
  
  try {
    const result = await mailService.createAccount();
    
    if (result.success) {
      console.log('✅ Email created successfully:', result.data.email);
      res.status(201).json({
        success: true,
        email: result.data.email,
        id: result.data.id,
        token: result.data.token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        message: 'Temporary email created successfully'
      });
    } else {
      console.error('❌ Failed to create email:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to create temporary email'
      });
    }
  } catch (error) {
    console.error('💥 Error in create email route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while creating email'
    });
  }
}));

/**
 * @route   GET /api/mail/inbox
 * @desc    Get inbox messages for a temporary email
 * @access  Public
 */
router.get('/inbox', asyncHandler(async (req, res) => {
  const { email } = req.query;
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  console.log('📬 Fetching inbox for:', email);
  console.log('📬 Token provided:', token ? 'Yes' : 'No');
  
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email address is required'
    });
  }
  
  try {
    const result = await mailService.getMessages(email, token);
    
    if (result.success) {
      console.log(`✅ Found ${result.data.messages?.length || 0} messages`);
      res.status(200).json({
        success: true,
        messages: result.data.messages || [],
        total: result.data.total || 0,
        email: email
      });
    } else {
      console.error('❌ Failed to fetch messages:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch messages'
      });
    }
  } catch (error) {
    console.error('💥 Error in inbox route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching inbox'
    });
  }
}));

/**
 * @route   GET /api/mail/message/:id
 * @desc    Get a specific message by ID
 * @access  Public
 */
router.get('/message/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  console.log('📄 Fetching message:', id);
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Message ID is required'
    });
  }
  
  try {
    const result = await mailService.getMessage(id, token);
    
    if (result.success) {
      console.log('✅ Message fetched successfully');
      res.status(200).json({
        success: true,
        message: result.data
      });
    } else {
      console.error('❌ Failed to fetch message:', result.error);
      res.status(404).json({
        success: false,
        error: result.error || 'Message not found'
      });
    }
  } catch (error) {
    console.error('💥 Error in message route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching message'
    });
  }
}));

/**
 * @route   DELETE /api/mail/delete
 * @desc    Delete a temporary email address
 * @access  Public
 */
router.delete('/delete', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  console.log('🗑️ Deleting email:', email);
  
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email address is required'
    });
  }
  
  try {
    const result = await mailService.deleteAccount(email, token);
    
    if (result.success) {
      console.log('✅ Email deleted successfully');
      res.status(200).json({
        success: true,
        message: 'Email deleted successfully'
      });
    } else {
      console.error('❌ Failed to delete email:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to delete email'
      });
    }
  } catch (error) {
    console.error('💥 Error in delete route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while deleting email'
    });
  }
}));

/**
 * @route   GET /api/mail/domains
 * @desc    Get available email domains
 * @access  Public
 */
router.get('/domains', asyncHandler(async (req, res) => {
  console.log('🌐 Fetching available domains...');
  
  try {
    const result = await mailService.getDomains();
    
    if (result.success) {
      console.log('✅ Domains fetched successfully');
      res.status(200).json({
        success: true,
        domains: result.data
      });
    } else {
      console.error('❌ Failed to fetch domains:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch domains'
      });
    }
  } catch (error) {
    console.error('💥 Error in domains route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching domains'
    });
  }
}));

module.exports = router;