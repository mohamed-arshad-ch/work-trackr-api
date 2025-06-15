# WorkTrackr User API Documentation

## 📋 Overview

This document provides comprehensive documentation for all User-related API endpoints in the WorkTrackr application. The API follows RESTful principles and uses JWT-based authentication.

**Base URL:** `http://localhost:3000/api`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication with two types of tokens:
- **Access Token**: Short-lived (15 minutes) for API access
- **Refresh Token**: Long-lived (7 days) for obtaining new access tokens

### Authentication Header Format
```
Authorization: Bearer <access_token>
```

---

## 📚 API Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account with optional company information.

**Authentication:** Not required

**Content-Type:** `application/json`

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "firstName": "string (optional, 2-50 chars)",
  "lastName": "string (optional, 2-50 chars)",
  "companyName": "string (optional, 2-100 chars)",
  "companyAddress": "string (optional, max 200 chars)",
  "taxId": "string (optional, max 50 chars)",
  "hourlyRate": "number (optional, positive, max 2 decimals)"
}
```

#### Sample Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corporation",
  "companyAddress": "123 Business St, Suite 100, New York, NY 10001",
  "taxId": "12-3456789",
  "hourlyRate": 75.50
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1234567890abcdef",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "companyName": "Acme Corporation",
      "companyAddress": "123 Business St, Suite 100, New York, NY 10001",
      "taxId": "12-3456789",
      "hourlyRate": "75.50",
      "companyLogo": null,
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive access tokens.

**Authentication:** Not required

**Content-Type:** `application/json`

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Sample Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1234567890abcdef",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "companyName": "Acme Corporation",
      "companyAddress": "123 Business St, Suite 100, New York, NY 10001",
      "taxId": "12-3456789",
      "hourlyRate": "75.50",
      "companyLogo": "/uploads/logos/logo-1642234567890-123456789.png",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:45:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 3. Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Description:** Generate new access token using refresh token.

**Authentication:** Not required (uses refresh token in body)

**Content-Type:** `application/json`

#### Request Body
```json
{
  "refreshToken": "string (required)"
}
```

#### Sample Request
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 4. User Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and invalidate refresh token.

**Authentication:** Required (Bearer token)

#### Request Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 5. Get User Profile

**Endpoint:** `GET /user/profile`

**Description:** Retrieve current user's profile information.

**Authentication:** Required (Bearer token)

#### Request Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "clx1234567890abcdef",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "companyName": "Acme Corporation",
      "companyAddress": "123 Business St, Suite 100, New York, NY 10001",
      "taxId": "12-3456789",
      "hourlyRate": "75.50",
      "companyLogo": "/uploads/logos/logo-1642234567890-123456789.png",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:45:00.000Z"
    }
  }
}
```

---

### 6. Update User Profile

**Endpoint:** `PUT /user/profile`

**Description:** Update user profile information. At least one field must be provided.

**Authentication:** Required (Bearer token)

**Content-Type:** `application/json`

#### Request Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```json
{
  "firstName": "string (optional, 2-50 chars)",
  "lastName": "string (optional, 2-50 chars)",
  "companyName": "string (optional, 2-100 chars)",
  "companyAddress": "string (optional, max 200 chars)",
  "taxId": "string (optional, max 50 chars)",
  "hourlyRate": "number (optional, positive, max 2 decimals)"
}
```

#### Sample Request
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "companyName": "Smith Consulting LLC",
  "companyAddress": "456 Oak Avenue, Suite 200, Los Angeles, CA 90210",
  "taxId": "98-7654321",
  "hourlyRate": 85.00
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "clx1234567890abcdef",
      "email": "john.doe@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "companyName": "Smith Consulting LLC",
      "companyAddress": "456 Oak Avenue, Suite 200, Los Angeles, CA 90210",
      "taxId": "98-7654321",
      "hourlyRate": "85.00",
      "companyLogo": "/uploads/logos/logo-1642234567890-123456789.png",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  }
}
```

---

### 7. Upload Company Logo

**Endpoint:** `POST /user/upload-logo`

**Description:** Upload company logo image file. Replaces existing logo if present.

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

#### Request Headers
```
Authorization: Bearer <access_token>
```

#### Request Body (Form Data)
```
logo: [image file] (required)
```

#### File Requirements
- **Max Size:** 2MB (2,097,152 bytes)
- **Allowed Types:** JPEG, JPG, PNG, GIF, WebP
- **Field Name:** `logo`

#### Sample Request (using curl)
```bash
curl -X POST \
  http://localhost:3000/api/user/upload-logo \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -F 'logo=@/path/to/company-logo.png'
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "data": {
    "user": {
      "id": "clx1234567890abcdef",
      "email": "john.doe@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "companyName": "Smith Consulting LLC",
      "companyAddress": "456 Oak Avenue, Suite 200, Los Angeles, CA 90210",
      "taxId": "98-7654321",
      "hourlyRate": "85.00",
      "companyLogo": "uploads/logos/logo-1642234567890-987654321.png",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T15:10:00.000Z"
    },
    "logoUrl": "/uploads/logos/logo-1642234567890-987654321.png"
  }
}
```

---

## ❌ Error Responses

All error responses follow a consistent format:

### Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": ["Detailed error messages"] // Only for validation errors
}
```

### Common Error Codes

#### Authentication Errors

**401 Unauthorized - Missing Token**
```json
{
  "success": false,
  "message": "Access token required",
  "error": "AUTHENTICATION_ERROR"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "success": false,
  "message": "Invalid token",
  "error": "INVALID_TOKEN"
}
```

**401 Unauthorized - Expired Token**
```json
{
  "success": false,
  "message": "Token expired",
  "error": "TOKEN_EXPIRED"
}
```

**401 Unauthorized - Invalid Credentials**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "OPERATIONAL_ERROR"
}
```

**401 Unauthorized - Invalid Refresh Token**
```json
{
  "success": false,
  "message": "Invalid refresh token",
  "error": "OPERATIONAL_ERROR"
}
```

#### Validation Errors

**400 Bad Request - Validation Failed**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters long",
    "First name must be at least 2 characters long"
  ]
}
```

**400 Bad Request - Invalid Email Format**
```json
{
  "success": false,
  "message": "Please provide a valid email address",
  "error": "VALIDATION_ERROR",
  "errors": ["Please provide a valid email address"]
}
```

**400 Bad Request - Password Requirements**
```json
{
  "success": false,
  "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  "error": "OPERATIONAL_ERROR"
}
```

**400 Bad Request - Update Profile (No Fields)**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "errors": ["At least one field must be provided for update"]
}
```

#### File Upload Errors

**400 Bad Request - No File Uploaded**
```json
{
  "success": false,
  "message": "No file uploaded",
  "error": "FILE_REQUIRED"
}
```

**400 Bad Request - File Too Large**
```json
{
  "success": false,
  "message": "File too large. Maximum size is 2MB.",
  "error": "FILE_TOO_LARGE"
}
```

**400 Bad Request - Invalid File Type**
```json
{
  "success": false,
  "message": "Only image files (JPEG, PNG, GIF, WebP) are allowed",
  "error": "VALIDATION_ERROR"
}
```

**400 Bad Request - Too Many Files**
```json
{
  "success": false,
  "message": "Too many files. Only one file allowed.",
  "error": "TOO_MANY_FILES"
}
```

**400 Bad Request - Wrong Field Name**
```json
{
  "success": false,
  "message": "Unexpected field name. Use \"logo\" as field name.",
  "error": "UNEXPECTED_FIELD"
}
```

#### Resource Errors

**404 Not Found - User Not Found**
```json
{
  "success": false,
  "message": "User not found",
  "error": "OPERATIONAL_ERROR"
}
```

**404 Not Found - Route Not Found**
```json
{
  "success": false,
  "message": "Route /api/invalid-endpoint not found",
  "error": "ROUTE_NOT_FOUND"
}
```

**409 Conflict - Email Already Exists**
```json
{
  "success": false,
  "message": "Email already registered",
  "error": "OPERATIONAL_ERROR"
}
```

#### Server Errors

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Something went wrong", // In production
  "error": "INTERNAL_SERVER_ERROR"
}
```

---

## 📋 Field Validation Rules

### User Registration & Profile Update

| Field | Type | Required | Min Length | Max Length | Additional Rules |
|-------|------|----------|------------|------------|------------------|
| `email` | string | Yes (register) | - | - | Valid email format, unique |
| `password` | string | Yes (register) | 8 | - | Must contain uppercase, lowercase, number, special char |
| `firstName` | string | No | 2 | 50 | - |
| `lastName` | string | No | 2 | 50 | - |
| `companyName` | string | No | 2 | 100 | - |
| `companyAddress` | string | No | - | 200 | - |
| `taxId` | string | No | - | 50 | - |
| `hourlyRate` | number | No | - | - | Positive number, max 2 decimal places |

### File Upload

| Property | Requirement |
|----------|-------------|
| Field Name | `logo` |
| Max Size | 2MB (2,097,152 bytes) |
| Allowed Types | JPEG, JPG, PNG, GIF, WebP |
| Max Files | 1 |

---

## 🔧 HTTP Status Codes

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| 200 | OK | Successful GET, PUT, POST (login, refresh, logout) |
| 201 | Created | Successful user registration |
| 400 | Bad Request | Validation errors, missing required fields |
| 401 | Unauthorized | Authentication required, invalid/expired tokens |
| 404 | Not Found | User not found, route not found |
| 409 | Conflict | Email already exists |
| 500 | Internal Server Error | Unexpected server errors |

---

## 🚀 Usage Examples

### Complete User Registration Flow

```javascript
// 1. Register new user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'Acme Corp'
  })
});

const { data } = await registerResponse.json();
const { accessToken, refreshToken } = data.tokens;

// 2. Upload company logo
const formData = new FormData();
formData.append('logo', logoFile);

const uploadResponse = await fetch('/api/user/upload-logo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

// 3. Update profile
const updateResponse = await fetch('/api/user/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    companyAddress: '123 Main St, City, State',
    hourlyRate: 75.00
  })
});
```

### Token Refresh Flow

```javascript
// When access token expires, use refresh token
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refreshToken: storedRefreshToken
  })
});

if (refreshResponse.ok) {
  const { data } = await refreshResponse.json();
  const { accessToken, refreshToken } = data.tokens;
  // Store new tokens
} else {
  // Redirect to login
}
```

---

## 📝 Notes

1. **Password Security**: Passwords are hashed using bcrypt with 12 salt rounds
2. **Token Storage**: Store refresh tokens securely (httpOnly cookies recommended)
3. **File Cleanup**: Old logos are automatically deleted when new ones are uploaded
4. **Rate Limiting**: Consider implementing rate limiting for production use
5. **HTTPS**: Always use HTTPS in production for secure token transmission
6. **CORS**: Configure CORS settings appropriately for your frontend domain

---

## 🔗 Related Documentation

- [Main API Documentation](README.md)
- [Database Schema](prisma/schema.prisma)
- [Environment Configuration](.env.example) 