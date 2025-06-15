# WorkTrackr API

A comprehensive REST API for WorkTrackr built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Profile Management**: Complete user profile management with company branding
- **File Upload**: Logo upload with validation (max 2MB, images only)
- **Security**: Bcrypt password hashing, Helmet security headers, CORS
- **Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling with custom error classes
- **Database**: PostgreSQL with Prisma ORM
- **TypeScript**: Full TypeScript support with strict typing

## 🏗️ Architecture

The application follows MVC (Model-View-Controller) architecture:

```
src/
├── controllers/     # Handle HTTP requests/responses
├── services/        # Business logic layer
├── models/          # Data access layer (Prisma client)
├── middleware/      # Authentication, validation, error handling
├── routes/          # API route definitions
├── utils/           # Helper functions
├── types/           # TypeScript interfaces
└── config/          # Database and app configuration
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WorkTrackr/API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV="development"
   MAX_FILE_SIZE=2097152
   UPLOAD_PATH="uploads/logos"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corp",
  "companyAddress": "123 Main St, City, State",
  "taxId": "123456789",
  "hourlyRate": 75.50
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer your-access-token
```

### User Profile

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer your-access-token
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "companyName": "New Company",
  "companyAddress": "456 Oak Ave, City, State",
  "taxId": "987654321",
  "hourlyRate": 85.00
}
```

#### Upload Logo
```http
POST /api/user/upload-logo
Authorization: Bearer your-access-token
Content-Type: multipart/form-data

logo: [image file]
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token (15 minutes) for API access
2. **Refresh Token**: Long-lived token (7 days) for obtaining new access tokens

Include the access token in the Authorization header:
```
Authorization: Bearer your-access-token
```

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": ["Detailed error messages"] // For validation errors
}
```

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Security**: Separate secrets for access and refresh tokens
- **Input Validation**: Joi schema validation for all inputs
- **File Upload Security**: File type and size validation
- **CORS**: Cross-Origin Resource Sharing enabled
- **Helmet**: Security headers middleware
- **Rate Limiting**: Built-in Express rate limiting

## 📁 File Upload

Logo upload specifications:
- **Max Size**: 2MB
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Storage**: Local filesystem (configurable)
- **Naming**: Unique timestamp-based filenames

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String
  firstName       String?
  lastName        String?
  companyName     String?
  companyLogo     String?
  companyAddress  String?
  taxId           String?
  hourlyRate      Decimal? @db.Decimal(10, 2)
  isEmailVerified Boolean  @default(false)
  refreshToken    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 🚀 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `JWT_EXPIRES_IN` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MAX_FILE_SIZE` | Max upload size in bytes | 2097152 |
| `UPLOAD_PATH` | Upload directory path | uploads/logos |

## 🐛 Error Codes

| Code | Description |
|------|-------------|
| `AUTHENTICATION_ERROR` | Invalid credentials or token |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `FILE_TOO_LARGE` | Uploaded file exceeds size limit |
| `INVALID_FILE_TYPE` | Unsupported file type |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

## 📄 License

This project is licensed under the ISC License. 