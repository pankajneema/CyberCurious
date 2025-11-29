# CyberSentinel API Routes

## Base URL
- **API Service**: `http://localhost:8000` (Direct access - no gateway needed!)

---

## 🔐 Authentication Routes

### POST `/api/v1/auth/signup`
User signup
```json
{
  "company_name": "Acme Corp",
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "admin",
  "country": "US"
}
```

### POST `/api/v1/auth/login`
User login
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### POST `/api/v1/auth/logout`
User logout

### POST `/api/v1/auth/magic-link`
Request magic link for passwordless login

### POST `/api/v1/auth/refresh`
Refresh access token

### POST `/api/v1/auth/forgot-password`
Request password reset

### POST `/api/v1/auth/reset-password`
Reset password with token

### GET `/api/v1/auth/verify`
Verify JWT token

---

## 👤 User Routes

### GET `/api/v1/users/me`
Get current authenticated user

### GET `/api/v1/users`
List all users (admin only)
- Query: `?skip=0&limit=100`

### GET `/api/v1/users/{user_id}`
Get user by ID

### PUT `/api/v1/users/{user_id}`
Update user

### DELETE `/api/v1/users/{user_id}`
Delete user

---

## 📝 Profile Routes

### GET `/api/v1/profile`
Get current user profile

### PUT `/api/v1/profile`
Update user profile
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "bio": "Security Engineer",
  "country": "US",
  "timezone": "America/New_York"
}
```

### PATCH `/api/v1/profile/avatar`
Update user avatar
```json
{
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### POST `/api/v1/profile/change-password`
Change user password
```json
{
  "current_password": "OldPass123",
  "new_password": "NewPass123"
}
```

---

## 🏢 Account Routes

### GET `/api/v1/accounts/{account_id}`
Get account information

### PUT `/api/v1/accounts/{account_id}`
Update account settings

### GET `/api/v1/accounts/{account_id}/members`
List account members

### POST `/api/v1/accounts/{account_id}/invite`
Invite member to account
```json
{
  "email": "newuser@example.com",
  "role": "analyst"
}
```

### DELETE `/api/v1/accounts/{account_id}/members/{member_id}`
Remove member from account

---

## 💳 Billing Routes

### GET `/api/v1/billing/plan`
Get current subscription plan

### POST `/api/v1/billing/subscribe`
Create or update subscription
```json
{
  "company_id": "uuid",
  "plan": "pro",
  "billing_period": "monthly"
}
```

### GET `/api/v1/billing/invoices`
List all invoices

### GET `/api/v1/billing/invoices/{invoice_id}`
Get invoice by ID

### POST `/api/v1/billing/payment-method`
Add payment method

### DELETE `/api/v1/billing/payment-method/{method_id}`
Remove payment method

### POST `/api/v1/billing/upgrade`
Upgrade subscription plan

### POST `/api/v1/billing/cancel`
Cancel subscription

---

## 🛠️ Services Routes

### GET `/api/v1/services`
List all available services

### GET `/api/v1/services/{service_id}`
Get service details

### POST `/api/v1/services/{service_id}/purchase`
Purchase a service

### POST `/api/v1/services/{service_id}/activate`
Activate a service

### POST `/api/v1/services/{service_id}/deactivate`
Deactivate a service

---

## 🔍 ASM Routes

### POST `/api/v1/asm/discover`
Start ASM discovery
```json
{
  "target": "example.com",
  "scan_type": "external"
}
```

### GET `/api/v1/asm/jobs/{job_id}`
Get discovery job status

### GET `/api/v1/asm/assets`
List discovered assets
- Query: `?skip=0&limit=100`

### GET `/api/v1/asm/assets/{asset_id}`
Get asset details

### DELETE `/api/v1/asm/assets/{asset_id}`
Delete asset

---

## 🛡️ Vulnerability Scanning Routes

### POST `/api/v1/scans`
Create vulnerability scan
```json
{
  "name": "External Scan - Production",
  "target": "api.example.com",
  "scan_type": "external",
  "frequency": "weekly"
}
```

### GET `/api/v1/scans`
List all scans
- Query: `?skip=0&limit=100`

### GET `/api/v1/scans/{scan_id}`
Get scan results

### POST `/api/v1/scans/{scan_id}/retest`
Retest a scan

### DELETE `/api/v1/scans/{scan_id}`
Delete scan

---

## ⚙️ Settings Routes

### GET `/api/v1/settings`
Get user settings

### PUT `/api/v1/settings`
Update user settings
```json
{
  "notifications": {
    "email": true,
    "slack": false,
    "push": true
  },
  "preferences": {
    "theme": "dark",
    "language": "en",
    "timezone": "UTC"
  }
}
```

---

## 📊 Activity & Audit Routes

### GET `/api/v1/activity`
Get user activity log
- Query: `?skip=0&limit=50`

### GET `/api/v1/audit-logs`
Get audit logs (admin only)
- Query: `?skip=0&limit=100`

---

## 🔑 Authentication

Most endpoints require authentication. Include JWT token in header:

```
Authorization: Bearer <your-token>
```

Get token from `/api/v1/auth/login` endpoint.

---

## 📝 Notes

- All routes are available directly on **API Service** at port **8000**
- No API Gateway - direct connection for better performance
- All responses are in JSON format
- Error responses follow RFC 7807 Problem Details format

