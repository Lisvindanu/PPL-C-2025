const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4',
  clientKey: 'SB-Mid-client-sySq1i7cCIQnCtxH'
});

async function createPayment() {
  const orderId = 'ORDER-' + Date.now();
  
  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: 100000
      },
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
        name: 'SkillConnect Service'
      }],
      credit_card: {
        secure: true
      }
    });

    console.log('\n✅ Payment URL Created!\n');
    console.log('Order ID:', orderId);
    console.log('Token:', transaction.token);
    console.log('\n🔗 CLICK THIS URL TO PAY:');
    console.log(transaction.redirect_url);
    console.log('\n📝 This URL is valid for 24 hours');
    console.log('💳 Test with Sandbox credentials\n');
    
    return transaction;
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.ApiResponse) {
      console.error('Response:', err.ApiResponse);
    }
  }
}

createPayment();
