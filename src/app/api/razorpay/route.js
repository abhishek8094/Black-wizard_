
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Validate environment variables
function validateRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay environment variables are not configured');
  }

  return { keyId, keySecret };
}

// Initialize Razorpay with validation
let razorpay;
try {
  const { keyId, keySecret } = validateRazorpayConfig();
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
  // We'll handle this in the POST function
}

export async function POST(request) {
  try {
    // Check if Razorpay is properly initialized
    if (!razorpay) {
      const { keyId, keySecret } = validateRazorpayConfig();
      razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }

    const { product, amount } = await request.json();

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount specified' },
        { status: 400 }
      );
    }

    // Create order options
    const options = {
      amount: Math.round(amount*100),
      currency: 'INR',
      receipt: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        productName: product?.name || 'Multiple items',
        createdAt: new Date().toISOString(),
      },
      payment_capture: 1,
    };


    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to create payment order';
    let statusCode = 500;

    if (error.code === 'BAD_REQUEST_ERROR') {
      errorMessage = 'Invalid payment request parameters';
      statusCode = 400;
    } else if (error.code === 'GATEWAY_ERROR') {
      errorMessage = 'Payment gateway error - please try again';
    } else if (error.message.includes('configuration')) {
      errorMessage = 'Payment service is not properly configured';
      statusCode = 503;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}
