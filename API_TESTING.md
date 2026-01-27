# API Testing Guide

Complete reference for testing Startup Vault APIs with curl or Postman.

## Base URL
```
Development: http://localhost:5000/api
Production: https://startup-vault-backend.onrender.com/api
```

---

## Authentication Routes

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "founder@startup.com",
    "password": "securepass123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "verificationToken": "abc123...",
  "email": "founder@startup.com"
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "founder@startup.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "founder@startup.com",
    "name": "John Doe",
    "isVerified": false,
    "company": null,
    "role": "founder"
  }
}
```

**Save token for authenticated requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### 3. Verify Email
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "verificationToken": "token_from_registration"
  }'
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

### 4. Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "founder@startup.com",
  "name": "John Doe",
  "isVerified": true,
  "company": "Acme Inc",
  "role": "founder",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 5. Update User Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jane Doe",
    "company": "Acme Inc",
    "role": "cto"
  }'
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "founder@startup.com",
  "name": "Jane Doe",
  "isVerified": true,
  "company": "Acme Inc",
  "role": "cto"
}
```

---

## Deal Routes

### 1. Get All Deals (with filters)
```bash
# Get all deals
curl "http://localhost:5000/api/deals"

# With category filter
curl "http://localhost:5000/api/deals?category=hosting"

# With search
curl "http://localhost:5000/api/deals?search=stripe"

# With access level
curl "http://localhost:5000/api/deals?accessLevel=verified" \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl "http://localhost:5000/api/deals?limit=10&skip=0"

# Combined filters
curl "http://localhost:5000/api/deals?category=payment&search=stripe&limit=20&skip=0"
```

**Response:**
```json
{
  "deals": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Vercel Pro - 50% Off Annual",
      "description": "Deploy faster with unlimited projects...",
      "category": "hosting",
      "accessLevel": "public",
      "discount": 50,
      "discountType": "percentage",
      "maxClaims": 150,
      "currentClaims": 5,
      "partner": {
        "name": "Vercel",
        "logo": "https://...",
        "description": "The platform for frontend developers",
        "website": "https://vercel.com"
      },
      "terms": "Valid for 1 year...",
      "expiresAt": "2024-07-15T00:00:00Z",
      "isClaimed": false,
      "isLocked": false
    }
  ],
  "total": 50,
  "limit": 20,
  "skip": 0
}
```

### 2. Get Deal Details
```bash
curl "http://localhost:5000/api/deals/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Stripe - $500 Credit",
  "description": "Accept payments globally...",
  "category": "payment",
  "accessLevel": "verified",
  "discount": 500,
  "discountType": "flat",
  "maxClaims": 50,
  "currentClaims": 12,
  "partner": {
    "name": "Stripe",
    "logo": "https://...",
    "description": "Payment processing for internet businesses",
    "website": "https://stripe.com"
  },
  "terms": "Valid for 12 months...",
  "expiresAt": "2025-01-15T00:00:00Z",
  "isLocked": false,
  "userClaim": {
    "status": "approved",
    "code": "STR-1234567890"
  }
}
```

### 3. Claim a Deal
```bash
curl -X POST http://localhost:5000/api/deals/507f1f77bcf86cd799439011/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

**Response (Success):**
```json
{
  "id": "607f1f77bcf86cd799439022",
  "status": "pending",
  "code": "VERCL-LKSDJF123",
  "claimedAt": "2024-01-15T15:30:00Z"
}
```

**Error Response (Already Claimed):**
```json
{
  "error": "You have already claimed this deal"
}
```

**Error Response (Not Verified):**
```json
{
  "error": "This deal requires verified email"
}
```

**Error Response (Limit Reached):**
```json
{
  "error": "This deal has reached its claim limit"
}
```

---

## Claims Routes

### 1. Get User's Claims
```bash
# Get all claims
curl "http://localhost:5000/api/claims" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl "http://localhost:5000/api/claims?status=approved" \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl "http://localhost:5000/api/claims?limit=10&skip=0" \
  -H "Authorization: Bearer $TOKEN"

# Combined
curl "http://localhost:5000/api/claims?status=pending&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "claims": [
    {
      "id": "607f1f77bcf86cd799439022",
      "dealId": "507f1f77bcf86cd799439011",
      "dealTitle": "Vercel Pro - 50% Off Annual",
      "dealCategory": "hosting",
      "status": "approved",
      "code": "VERCL-LKSDJF123",
      "claimedAt": "2024-01-15T15:30:00Z",
      "approvedAt": "2024-01-16T10:00:00Z"
    },
    {
      "id": "607f1f77bcf86cd799439023",
      "dealId": "507f1f77bcf86cd799439012",
      "dealTitle": "Stripe - $500 Credit",
      "dealCategory": "payment",
      "status": "pending",
      "code": "STR-ABCDEF789",
      "claimedAt": "2024-01-14T12:00:00Z",
      "approvedAt": null
    }
  ],
  "total": 5,
  "limit": 20,
  "skip": 0
}
```

### 2. Get Single Claim
```bash
curl "http://localhost:5000/api/claims/607f1f77bcf86cd799439022" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "id": "607f1f77bcf86cd799439022",
  "dealId": "507f1f77bcf86cd799439011",
  "dealTitle": "Vercel Pro - 50% Off Annual",
  "status": "approved",
  "code": "VERCL-LKSDJF123",
  "claimedAt": "2024-01-15T15:30:00Z",
  "approvedAt": "2024-01-16T10:00:00Z"
}
```

### 3. Get Claims Statistics
```bash
curl "http://localhost:5000/api/claims/stats/overview" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "pending": 2,
  "approved": 3,
  "rejected": 1,
  "total": 6
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error: Password must be at least 6 characters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "This action requires verified email. Please complete email verification."
}
```

### 404 Not Found
```json
{
  "error": "Deal not found"
}
```

### 409 Conflict
```json
{
  "error": "email already exists"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing Workflow

### Complete User Journey

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@startup.com",
    "password": "testpass123",
    "name": "Test User"
  }' | jq -r '.verificationToken')

echo "Verification Token: $TOKEN"

# 2. Verify email
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d "{\"verificationToken\": \"$TOKEN\"}"

# 3. Login
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@startup.com",
    "password": "testpass123"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Auth Token: $TOKEN"

# 4. Get profile
curl -s http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# 5. Get deals
curl -s "http://localhost:5000/api/deals?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 6. Get first deal ID and claim it
DEAL_ID=$(curl -s "http://localhost:5000/api/deals?limit=1" | jq -r '.deals[0]._id')
curl -s -X POST "http://localhost:5000/api/deals/$DEAL_ID/claim" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 7. Get user's claims
curl -s http://localhost:5000/api/claims \
  -H "Authorization: Bearer $TOKEN" | jq .

# 8. Get claims statistics
curl -s http://localhost:5000/api/claims/stats/overview \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "Startup Vault API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@startup.com\",\"password\":\"testpass123\",\"name\":\"Test User\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@startup.com\",\"password\":\"testpass123\"}"
        }
      }
    },
    {
      "name": "Get Deals",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/deals",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Rate Limiting Notes

Currently no rate limiting implemented. For production:
- Limit login attempts: 5 per 15 minutes per IP
- Limit API requests: 100 per minute per user
- Limit claim requests: 10 per hour per user

---

## JWT Token Debugging

To decode JWT token:

```bash
# Install jwt-cli or use online decoder
npm install -g jwt-cli

# Decode token
jwt decode "your_token_here"

# Check expiry
jwt decode "your_token_here" | grep exp
```

---

## Next Steps

1. Test all endpoints with provided examples
2. Verify error handling
3. Test with frontend application
4. Load test with large data sets
5. Monitor database performance
