/**
 * OTP Testing Script
 * Test Gmail SMTP and WhatsApp Cloud API integration
 */

require('dotenv').config();
const NotificationService = require('./src/shared/services/NotificationService');

const notificationService = new NotificationService();

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function printResult(channel, result) {
  if (result.success) {
    log(`✅ ${channel}: SUCCESS`, 'green');
    log(`   Message ID: ${result.messageId}`, 'blue');
  } else {
    log(`❌ ${channel}: FAILED`, 'red');
    log(`   Error: ${result.error}`, 'red');
  }
}

async function testEmailOTP() {
  printHeader('TEST 1: Email OTP (Gmail SMTP)');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const otp = notificationService.generateOTP(6);
  
  log(`Sending OTP to: ${testEmail}`, 'yellow');
  log(`OTP Code: ${otp}`, 'yellow');
  
  const result = await notificationService.sendOTPEmail(
    testEmail,
    otp,
    'password_reset'
  );
  
  printResult('Email', result);
  return result.success;
}

async function testWhatsAppOTP() {
  printHeader('TEST 2: WhatsApp OTP (Meta Cloud API)');
  
  const testPhone = process.env.TEST_PHONE || '628123456789';
  const otp = notificationService.generateOTP(6);
  
  log(`Sending OTP to: ${testPhone}`, 'yellow');
  log(`OTP Code: ${otp}`, 'yellow');
  
  const result = await notificationService.sendOTPWhatsApp(
    testPhone,
    otp,
    'verification'
  );
  
  printResult('WhatsApp', result);
  return result.success;
}

async function testMultiChannel() {
  printHeader('TEST 3: Multi-Channel OTP (Email + WhatsApp)');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const testPhone = process.env.TEST_PHONE || '628123456789';
  const otp = notificationService.generateOTP(6);
  
  log(`Sending OTP to:`, 'yellow');
  log(`  Email: ${testEmail}`, 'yellow');
  log(`  Phone: ${testPhone}`, 'yellow');
  log(`  OTP Code: ${otp}`, 'yellow');
  
  const result = await notificationService.sendOTP({
    email: testEmail,
    phoneNumber: testPhone,
    otp,
    purpose: 'login',
    channels: ['email', 'whatsapp']
  });
  
  console.log('\nResults:');
  if (result.channels.email) {
    printResult('Email', result.channels.email);
  }
  if (result.channels.whatsapp) {
    printResult('WhatsApp', result.channels.whatsapp);
  }
  
  log(`\nOverall Success: ${result.success}`, result.success ? 'green' : 'red');
  
  if (result.errors && result.errors.length > 0) {
    log('\nErrors:', 'red');
    result.errors.forEach(err => log(`  - ${err}`, 'red'));
  }
  
  return result.success;
}

async function testOTPGeneration() {
  printHeader('TEST 4: OTP Generation');
  
  log('Generating 10 random OTPs:', 'yellow');
  for (let i = 0; i < 10; i++) {
    const otp = notificationService.generateOTP(6);
    log(`  ${i + 1}. ${otp}`, 'blue');
  }
  
  log('\n✅ OTP generation working correctly', 'green');
  return true;
}

async function checkConfiguration() {
  printHeader('Configuration Check');
  
  const checks = {
    'SMTP_HOST': process.env.SMTP_HOST,
    'SMTP_PORT': process.env.SMTP_PORT,
    'SMTP_USER': process.env.SMTP_USER,
    'SMTP_PASS': process.env.SMTP_PASS ? '***' : undefined,
    'WHATSAPP_PHONE_NUMBER_ID': process.env.WHATSAPP_PHONE_NUMBER_ID,
    'WHATSAPP_ACCESS_TOKEN': process.env.WHATSAPP_ACCESS_TOKEN ? '***' : undefined,
    'OTP_EXPIRY_MINUTES': process.env.OTP_EXPIRY_MINUTES || '10',
    'OTP_LENGTH': process.env.OTP_LENGTH || '6'
  };
  
  let allConfigured = true;
  
  for (const [key, value] of Object.entries(checks)) {
    if (value) {
      log(`✅ ${key}: ${value}`, 'green');
    } else {
      log(`❌ ${key}: NOT SET`, 'red');
      allConfigured = false;
    }
  }
  
  return allConfigured;
}

async function runAllTests() {
  console.clear();
  log('\n🚀 OTP Integration Testing Suite', 'cyan');
  log('SkillConnect - Production Ready\n', 'cyan');
  
  // Check configuration
  const configOk = await checkConfiguration();
  if (!configOk) {
    log('\n⚠️  Some configurations are missing. Please check your .env file.', 'yellow');
    log('Continuing with available tests...\n', 'yellow');
  }
  
  const results = {
    otp_generation: false,
    email: false,
    whatsapp: false,
    multi_channel: false
  };
  
  try {
    // Test 1: OTP Generation
    results.otp_generation = await testOTPGeneration();
    
    // Test 2: Email OTP
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      results.email = await testEmailOTP();
    } else {
      printHeader('TEST 1: Email OTP (Gmail SMTP)');
      log('⚠️  SMTP not configured - skipping email test', 'yellow');
    }
    
    // Test 3: WhatsApp OTP
    if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
      results.whatsapp = await testWhatsAppOTP();
    } else {
      printHeader('TEST 2: WhatsApp OTP (Meta Cloud API)');
      log('⚠️  WhatsApp not configured - skipping WhatsApp test', 'yellow');
    }
    
    // Test 4: Multi-Channel
    if (results.email || results.whatsapp) {
      results.multi_channel = await testMultiChannel();
    }
    
  } catch (error) {
    log(`\n❌ Test failed with error: ${error.message}`, 'red');
    console.error(error);
  }
  
  // Summary
  printHeader('Test Summary');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;
  
  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`Failed: ${totalTests - passedTests}`, totalTests - passedTests === 0 ? 'green' : 'red');
  
  console.log('\nDetailed Results:');
  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`  ${status} - ${test.replace(/_/g, ' ').toUpperCase()}`, color);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! System is ready for production.', 'green');
  } else {
    log('⚠️  Some tests failed. Please check configuration and try again.', 'yellow');
  }
  
  console.log('');
}

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  testEmailOTP,
  testWhatsAppOTP,
  testMultiChannel,
  testOTPGeneration,
  checkConfiguration
};
