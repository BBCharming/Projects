#!/bin/bash

echo "🧪 Testing Mwaba Connection..."

# Test backend
echo "1. Testing backend connection..."
curl -s http://localhost:3000/ping || echo "Backend not running"

echo ""

# Test API endpoint
echo "2. Testing API endpoint..."
curl -s -X POST http://localhost:3000/api/whatsapp/reply \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello Mwaba"}' | jq . 2>/dev/null || curl -s -X POST http://localhost:3000/api/whatsapp/reply \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello Mwaba"}'

echo ""
echo "✅ Test completed"
