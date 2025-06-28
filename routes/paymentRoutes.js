const express = require('express');
const axios = require('axios');
const router = express.Router();

// Use environment variables for Flutterwave keys
const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3';
const FLUTTERWAVE_SECRET_KEY = process.env.FLW_SECRET_KEY || 'FLWSECK_TEST-4583ca0ecf022faeae1c25051f0ded27-X';
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY || 'FLWPUBK_TEST-683106d90bfca0e7ad79a7f7329103ca-X';

// console.log('Flutterwave Configuration:');
// console.log('- API URL:', FLUTTERWAVE_API_URL);
// console.log('- Secret Key:', FLUTTERWAVE_SECRET_KEY ? 'Configured' : 'Not configured');
// console.log('- Public Key:', FLUTTERWAVE_PUBLIC_KEY ? 'Configured' : 'Not configured');

// Create axios instance for Flutterwave API
const flutterwaveAPI = axios.create({
  baseURL: FLUTTERWAVE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`
  }
});

// Initiate mobile money payment
router.post('/initiate-payment', async (req, res) => {
  try {
    const {
      amount,
      phone_number,
      email,
      tx_ref,
      consumer_id,
      customer_name,
      callback_url,
      redirect_url,
      country = 'rwanda' // Default to Rwanda, can be 'ghana', 'uganda', etc.
    } = req.body;

    // Validate required fields
    if (!amount || !phone_number || !email || !tx_ref) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, phone_number, email, tx_ref'
      });
    }

    // Map country to payment type and currency
    const paymentConfig = {
      rwanda: {
        type: 'mobile_money_rwanda',
        currency: 'RWF'
      },
      ghana: {
        type: 'mobile_money_ghana',
        currency: 'GHS'
      },
      uganda: {
        type: 'mobile_money_uganda',
        currency: 'UGX'
      },
      kenya: {
        type: 'mpesa',
        currency: 'KES'
      }
    };

    const config = paymentConfig[country.toLowerCase()];
    if (!config) {
      return res.status(400).json({
        success: false,
        message: `Unsupported country: ${country}. Supported: rwanda, ghana, uganda, kenya`
      });
    }

    const payload = {
      phone_number,
      amount: parseFloat(amount),
      currency: config.currency,
      email,
      tx_ref,
      redirect_url: redirect_url || 'https://webhook.site/077164d9-29cb-40df-ba29-8a00e59a7e60',
      callback_url: callback_url || 'https://webhook.site/077164d9-29cb-40df-ba29-8a00e59a7e60'
    };

    // console.log(`Initiating ${country} mobile money payment with payload:`, payload);

    // Use the correct endpoint for the selected country
    const response = await flutterwaveAPI.post(`/charges?type=${config.type}`, payload);
    
    // console.log('Flutterwave response:', response.data);

    // Check if the response indicates success
    if (response.data.status === 'success') {
      res.json({
        success: true,
        data: response.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment initiation failed',
        error: response.data.message || 'Unknown error',
        data: response.data
      });
    }

  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.response?.data?.message || error.message
    });
  }
});

// Verify payment
router.get('/verify-payment/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    const response = await flutterwaveAPI.get(`/transactions/${transactionId}/verify`);
    
    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.response?.data?.message || error.message
    });
  }
});

// Test payment endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Payment routes are working!',
    config: {
      api_url: FLUTTERWAVE_API_URL,
      secret_key: FLUTTERWAVE_SECRET_KEY ? 'Configured' : 'Not configured'
    }
  });
});

// Test card payment endpoint
router.post('/test-card-payment', async (req, res) => {
  try {
    const {
      amount,
      email,
      tx_ref,
      card_number = '5531886652142950', // Test card
      cvv = '564',
      expiry_month = '09',
      expiry_year = '32'
    } = req.body;

    const payload = {
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      amount: parseFloat(amount),
      currency: 'NGN',
      email,
      tx_ref,
      redirect_url: 'https://ecotunga.com/payment/redirect'
    };

    // console.log('Testing card payment with payload:', payload);

    const response = await flutterwaveAPI.post('/charges?type=card', payload);
    
    // console.log('Card payment response:', response.data);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Card payment test error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Card payment test failed',
      error: error.response?.data?.message || error.message
    });
  }
});

// Test sandbox environment
router.get('/sandbox-test', async (req, res) => {
  try {
    // Test basic API connectivity
    const response = await flutterwaveAPI.get('/banks/NG');
    
    res.json({
      success: true,
      message: 'Sandbox environment is working!',
      config: {
        api_url: FLUTTERWAVE_API_URL,
        secret_key: FLUTTERWAVE_SECRET_KEY ? 'Configured' : 'Not configured',
        public_key: FLUTTERWAVE_PUBLIC_KEY ? 'Configured' : 'Not configured',
        environment: 'sandbox'
      },
      test_response: {
        status: response.data.status,
        message: response.data.message,
        banks_count: response.data.data ? response.data.data.length : 0
      }
    });
  } catch (error) {
    console.error('Sandbox test error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Sandbox test failed',
      error: error.response?.data?.message || error.message,
      config: {
        api_url: FLUTTERWAVE_API_URL,
        secret_key: FLUTTERWAVE_SECRET_KEY ? 'Configured' : 'Not configured',
        public_key: FLUTTERWAVE_PUBLIC_KEY ? 'Configured' : 'Not configured',
        environment: 'sandbox'
      }
    });
  }
});

// Test different phone number formats and payment methods
router.post('/test-mobile-money', async (req, res) => {
  try {
    const { phone_number, amount = 100, email = 'test@ecotunga.com' } = req.body;
    
    // Test different phone number formats
    const phoneFormats = [
      phone_number, // Original format
      phone_number.startsWith('0') ? phone_number.replace('0', '+250') : phone_number, // Add country code
      phone_number.startsWith('+250') ? phone_number : `+250${phone_number.replace('0', '')}`, // Ensure +250 format
      phone_number.replace(/^0/, '+250') // Replace leading 0 with +250
    ];

    const results = [];

    for (let i = 0; i < phoneFormats.length; i++) {
      const testPhone = phoneFormats[i];
      const txRef = `TEST_${Date.now()}_${i}`;
      
      try {
        const payload = {
          phone_number: testPhone,
          amount: parseFloat(amount),
          currency: 'RWF',
          email,
          tx_ref: txRef,
          redirect_url: 'https://webhook.site/077164d9-29cb-40df-ba29-8a00e59a7e60',
          callback_url: 'https://webhook.site/077164d9-29cb-40df-ba29-8a00e59a7e60'
        };

        // console.log(`Testing phone format ${i + 1}: ${testPhone}`);
        const response = await flutterwaveAPI.post('/charges?type=mobile_money_rwanda', payload);
        
        results.push({
          phone_format: testPhone,
          success: true,
          response: response.data,
          tx_ref: txRef
        });
      } catch (error) {
        results.push({
          phone_format: testPhone,
          success: false,
          error: error.response?.data?.message || error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Mobile money test completed',
      results,
      recommendations: [
        'Check if any of the phone formats work',
        'Try using a different test phone number',
        'Contact Flutterwave support to enable SMS for your test account',
        'Consider testing with card payments instead'
      ]
    });

  } catch (error) {
    console.error('Mobile money test error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Mobile money test failed',
      error: error.response?.data?.message || error.message
    });
  }
});

// Test with different payment types
router.post('/test-payment-types', async (req, res) => {
  try {
    const { phone_number, amount = 100, email = 'test@ecotunga.com' } = req.body;
    const txRef = `TEST_TYPES_${Date.now()}`;
    
    const paymentTypes = [
      'mobile_money_rwanda',
      'mobilemoneyrw',
      'mobile_money_rw'
    ];

    const results = [];

    for (const paymentType of paymentTypes) {
      try {
        const payload = {
          phone_number,
          amount: parseFloat(amount),
          currency: 'RWF',
          email,
          tx_ref: `${txRef}_${paymentType}`,
          redirect_url: 'https://webhook.site/077164d9-29cb-40df-ba29-8a00e59a7e60',
          callback_url: 'https://webhook.site/077164d9-29cb-40df-ba29-8a00e59a7e60'
        };

        // console.log(`Testing payment type: ${paymentType}`);
        const response = await flutterwaveAPI.post(`/charges?type=${paymentType}`, payload);
        
        results.push({
          payment_type: paymentType,
          success: true,
          response: response.data
        });
      } catch (error) {
        results.push({
          payment_type: paymentType,
          success: false,
          error: error.response?.data?.message || error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Payment types test completed',
      results
    });

  } catch (error) {
    console.error('Payment types test error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: 'Payment types test failed',
      error: error.response?.data?.message || error.message
    });
  }
});

// Test endpoint that simulates successful payment (for development)
router.post('/test-simple-payment', async (req, res) => {
  try {
    const { phone_number, amount = 100, email = 'test@ecotunga.com' } = req.body;
    const txRef = `TEST_SIMPLE_${Date.now()}`;
    
    // Simulate successful payment without CAPTCHA
    const mockResponse = {
      status: 'success',
      message: 'Payment completed successfully',
      data: {
        id: Math.floor(Math.random() * 1000000),
        tx_ref: txRef,
        flw_ref: `FLW-MOCK-${Date.now()}`,
        amount: parseFloat(amount),
        currency: 'RWF',
        status: 'successful',
        payment_type: 'mobilemoneyrw',
        customer: {
          email: email,
          phone_number: phone_number,
          name: 'Test User'
        },
        meta: {
          authorization: {
            redirect: null,
            mode: 'completed'
          }
        }
      }
    };

    // console.log('Simulating successful payment:', mockResponse);

    res.json({
      success: true,
      message: 'Payment simulation completed successfully',
      data: mockResponse,
      note: 'This is a simulation for testing purposes. In production, real SMS will be sent.'
    });

  } catch (error) {
    console.error('Payment simulation error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Payment simulation failed',
      error: error.message
    });
  }
});

module.exports = router; 