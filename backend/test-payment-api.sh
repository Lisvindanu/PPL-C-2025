#!/bin/bash

# Test Create Payment API dengan Midtrans
echo "=== Testing Create Payment API with Midtrans ==="
echo ""

# Note: Ganti dengan token JWT yang valid
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "pesanan_id": "test-order-123",
    "user_id": "test-user-456",
    "jumlah": 100000,
    "metode_pembayaran": "qris",
    "customer_email": "test@example.com",
    "customer_name": "Test User",
    "customer_phone": "081234567890",
    "order_title": "Test Service Payment"
  }' | jq '.'

