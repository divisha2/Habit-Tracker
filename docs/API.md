# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET /auth/me
Get current user information (Protected).

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Habits

### GET /habits
Get all habits for the authenticated user (Protected).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "habit-id",
      "name": "Morning Water",
      "description": "Drink a glass of water first thing in the morning",
      "category": "health",
      "color": "#DA627D",
      "frequency": "daily",
      "userId": "user-id",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /habits
Create a new habit (Protected).

**Request Body:**
```json
{
  "name": "Morning Water",
  "description": "Drink a glass of water first thing in the morning",
  "category": "health",
  "frequency": "daily"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit created successfully",
  "data": {
    "_id": "habit-id",
    "name": "Morning Water",
    "description": "Drink a glass of water first thing in the morning",
    "category": "health",
    "color": "#DA627D",
    "frequency": "daily",
    "userId": "user-id",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### PUT /habits/:id
Update an existing habit (Protected).

**Request Body:**
```json
{
  "name": "Updated Habit Name",
  "description": "Updated description",
  "category": "mindfulness"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit updated successfully",
  "data": {
    "_id": "habit-id",
    "name": "Updated Habit Name",
    "description": "Updated description",
    "category": "mindfulness",
    "color": "#DA627D",
    "frequency": "daily",
    "userId": "user-id",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### DELETE /habits/:id
Delete a habit (Protected).

**Response:**
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

## Logs

### POST /logs/toggle
Toggle habit completion for today (Protected).

**Request Body:**
```json
{
  "habitId": "habit-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit toggled successfully",
  "data": {
    "_id": "log-id",
    "habitId": "habit-id",
    "userId": "user-id",
    "date": "2026-01-01",
    "completed": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

## Statistics

### GET /stats/dashboard
Get dashboard statistics (Protected).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalHabits": 4,
    "completedToday": 2,
    "completionRate": 50,
    "currentStreak": 7,
    "longestStreak": 25,
    "weeklyData": [
      {
        "date": "2026-01-01",
        "completions": 3,
        "percentage": 75
      }
    ]
  }
}
```

### GET /stats/habit/:habitId
Get statistics for a specific habit (Protected).

**Response:**
```json
{
  "success": true,
  "data": {
    "habitId": "habit-id",
    "currentStreak": 12,
    "longestStreak": 25,
    "totalCompletions": 150,
    "completionRate": 85,
    "monthlyData": [
      {
        "date": "2026-01-01",
        "completed": true
      }
    ]
  }
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Rate Limiting
- 100 requests per 15 minutes per IP address
- Exceeded limits return `429 Too Many Requests`

### CORS
- Configured for frontend domain
- Credentials supported for authentication