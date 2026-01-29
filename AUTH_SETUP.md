# Authentication System Setup

## Overview
Complete authentication system with Sign Up, Sign In, and JWT-based session management.

## Backend Implementation

### New Files Created:
1. **server/models/User.js** - User schema with password hashing
2. **server/controllers/authController.js** - Register, login, and getCurrentUser endpoints
3. **server/middleware/auth.js** - JWT verification middleware
4. **server/routes/authRoutes.js** - Auth routes

### API Endpoints:
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (protected)

### Features:
- ✅ Password hashing with bcryptjs
- ✅ JWT token generation (30-day expiry)
- ✅ Email validation
- ✅ Password confirmation
- ✅ Error handling

## Frontend Implementation

### New Files Created:
1. **client/src/pages/SignUp.jsx** - Sign up form with validation
2. **client/src/pages/SignIn.jsx** - Sign in form
3. **Updated client/src/App.jsx** - Added routing and auth state
4. **Updated client/src/components/Navbar.jsx** - Auth buttons and user display

### Features:
- ✅ Form validation (email, password match, min length)
- ✅ Password visibility toggle
- ✅ Error messages
- ✅ Loading states
- ✅ Token storage in localStorage
- ✅ Protected routes (redirect to signin if not authenticated)
- ✅ User info display in navbar
- ✅ Sign out functionality

## How It Works

### Sign Up Flow:
1. User fills form (name, email, password, confirm password)
2. Frontend validates input
3. POST to `/api/auth/register`
4. Backend hashes password and creates user
5. Returns JWT token
6. Frontend stores token and redirects to dashboard

### Sign In Flow:
1. User enters email and password
2. POST to `/api/auth/login`
3. Backend verifies credentials
4. Returns JWT token
5. Frontend stores token and redirects to dashboard

### Protected Routes:
- Dashboard (`/`) - Only accessible if authenticated
- Sign Up/In pages - Only accessible if NOT authenticated
- Automatic redirect based on auth state

## Token Storage
- JWT token stored in `localStorage` as `token`
- User info stored in `localStorage` as `user` (JSON)
- Token sent in Authorization header for protected requests

## Environment Variables
```
JWT_SECRET=your-secret-key-change-in-production
```

## Testing the Auth System

### Sign Up:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Sign In:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Next Steps
1. Connect habits to user accounts (add userId to Habit model)
2. Update habit endpoints to filter by authenticated user
3. Add password reset functionality
4. Add email verification
5. Add refresh token mechanism
