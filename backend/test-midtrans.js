/**
 * Test Midtrans Integration
 * Run: node test-midtrans.js
 */

require('dotenv').config();
const MidtransService = require('./src/modules/payment/infrastructure/services/MidtransService');

async function testMidtransIntegration() {
  console.log('=== TESTING MIDTRANS INTEGRATION ===\n');

  const midtrans = new MidtransService();

  // Test 1: Create Transaction
  console.log('Test 1: Creating Midtrans Transaction...');
  try {
    const transactionId = `TEST-${Date.now()}`;
    const transaction = await midtrans.createTransaction({
      transaction_id: transactionId,
      gross_amount: 100000,
      customer_details: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '081234567890'
      },
      item_details: [{
        id: 'ITEM-1',
        price: 100000,
        quantity: 1,
        name: 'Test Service Payment'
      }],
      payment_method: 'qris'
    });

    console.log('✓ Transaction created successfully!');
    console.log('  Transaction ID:', transaction.transaction_id);
    console.log('  Snap Token:', transaction.token);
    console.log('  Payment URL:', transaction.payment_url);
    console.log('  Status:', transaction.status);
    console.log('');

    // Test 2: Verify Signature
    console.log('Test 2: Testing Signature Verification...');
    const mockNotification = {
      order_id: transaction.transaction_id,
      status_code: '200',
      gross_amount: '100000',
      signature_key: '1234567890' // This will fail
    };

    const isValid = await midtrans.verifyWebhookSignature(mockNotification);
    console.log('  Valid signature (should be false):', isValid);
    console.log('');

    // Test 3: Get Transaction Status
    console.log('Test 3: Getting Transaction Status...');
    try {
      const status = await midtrans.getPaymentStatus(transaction.transaction_id);
      console.log('✓ Status retrieved:');
      console.log('  Status:', status.status);
      console.log('  Payment Type:', status.payment_type);
      console.log('');
    } catch (error) {
      console.log('  Note: Status might be pending, this is normal');
      console.log('  Error:', error.message);
      console.log('');
    }

    console.log('=== ALL TESTS COMPLETED ===\n');
    console.log('Next steps:');
    console.log('1. Open the payment URL in browser to complete payment');
    console.log('2. Use Midtrans sandbox credentials to test payment');
    console.log('3. Check webhook notifications\n');
    console.log('Payment URL to test:');
    console.log(transaction.payment_url);

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    if (error.ApiResponse) {
      console.error('  API Response:', error.ApiResponse);
    }
    console.error('');
    process.exit(1);
  }
}

// Run test
testMidtransIntegration();
