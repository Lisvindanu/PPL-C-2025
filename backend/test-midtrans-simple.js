require('dotenv').config();
const midtransClient = require('midtrans-client');

console.log('=== SIMPLE MIDTRANS TEST ===\n');

// Test with minimal config
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4',
  clientKey: 'SB-Mid-client-sySq1i7cCIQnCtxH'
});

const orderId = 'TEST-SIMPLE-' + Date.now();
console.log('Creating transaction with order_id:', orderId);

snap.createTransaction({
  transaction_details: {
    order_id: orderId,
    gross_amount: 10000
  },
  credit_card: {
    secure: true
  }
}).then(transaction => {
  console.log('\n✅ SUCCESS!\n');
  console.log('Token:', transaction.token);
  console.log('\n📱 Open this URL to pay:');
  console.log(transaction.redirect_url);
  console.log('\n');
}).catch(err => {
  console.error('\n❌ ERROR:\n');
  console.error('Message:', err.message);
  if (err.ApiResponse) {
    console.error('Response:', JSON.stringify(err.ApiResponse, null, 2));
  }
  console.error('\n');
});
