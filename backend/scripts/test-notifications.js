#!/usr/bin/env node
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const EmailService = require('../src/modules/user/infrastructure/services/EmailService');

(async () => {
  const emailSvc = new EmailService();

  const testEmail = process.env.TEST_EMAIL || 'donylks9@gmail.com';

  console.log('== Test sendPasswordResetEmail ==');
  const emailRes = await emailSvc.sendPasswordResetEmail(testEmail, 'test-reset-token-123');
  console.log('Email result:', emailRes);

  process.exit(0);
})().catch((err) => {
  console.error('Test script error', err);
  process.exit(1);
});
