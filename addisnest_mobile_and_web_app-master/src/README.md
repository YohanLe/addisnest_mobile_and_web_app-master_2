# Addinest MongoDB Backend

This is the MongoDB backend for the Addinest real estate platform. It provides RESTful API endpoints for users, properties, conversations, messages, notifications, payments, and connection tests.

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Authentication](#authentication)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template
4. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGO_URI` in your `.env` file
5. Start the server:
   ```
   npm run dev
   ```

## Environment Variables

Copy the `.env.example` file to `.env` and update the values:

- `NODE_ENV`: Set to 'development' or 'production'
- `PORT`: Port number for the server
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: JWT token expiration time
- `FILE_UPLOAD_PATH`: Path for file uploads
- `FILE_UPLOAD_BASE_URL`: Base URL for accessing uploaded files
- `MAX_FILE_UPLOAD`: Maximum file upload size in bytes

## API Endpoints

### Users
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login user
- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID (admin only)
- `PUT /api/users/:id`: Update user (admin only)
- `DELETE /api/users/:id`: Delete user (admin only)

### Properties
- `GET /api/properties`: Get all properties
- `POST /api/properties`: Create a new property
- `GET /api/properties/:id`: Get a property by ID
- `PUT /api/properties/:id`: Update a property
- `DELETE /api/properties/:id`: Delete a property
- `PUT /api/properties/:id/photos`: Upload photos for a property
- `GET /api/properties/user/:userId`: Get properties by user
- `GET /api/properties/featured`: Get featured properties
- `GET /api/properties/search`: Search properties

### Conversations
- `GET /api/conversations`: Get all conversations for a user
- `POST /api/conversations`: Create or get a conversation
- `GET /api/conversations/:id`: Get a single conversation
- `PUT /api/conversations/:id/archive`: Archive a conversation
- `DELETE /api/conversations/:id`: Delete a conversation

### Messages
- `POST /api/messages`: Send a new message
- `GET /api/messages/conversation/:conversationId`: Get messages for a conversation
- `GET /api/messages/unread`: Get unread messages count
- `PUT /api/messages/:id/read`: Mark a message as read
- `DELETE /api/messages/:id`: Delete a message

### Notifications
- `GET /api/notifications`: Get all notifications for a user
- `GET /api/notifications/unread/count`: Get unread notification count
- `PUT /api/notifications/:id/read`: Mark a notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read
- `DELETE /api/notifications/:id`: Delete a notification
- `DELETE /api/notifications`: Delete all notifications
- `POST /api/notifications/system`: Create a system notification (admin only)

### Payments
- `POST /api/payments`: Create a new payment
- `GET /api/payments`: Get all payments for a user
- `GET /api/payments/:id`: Get a single payment
- `PUT /api/payments/:id/status`: Update payment status (admin only)
- `GET /api/payments/property/:propertyId`: Get payments for a property
- `GET /api/payments/stats`: Get payment statistics (admin only)

### Connection Tests
- `POST /api/connectiontests`: Create a new connection test
- `GET /api/connectiontests`: Get all connection tests for a user
- `GET /api/connectiontests/:id`: Get a single connection test
- `PUT /api/connectiontests/:id`: Update connection test results
- `DELETE /api/connectiontests/:id`: Delete a connection test
- `GET /api/connectiontests/stats`: Get connection test statistics (admin only)

## Models

The backend includes the following MongoDB models:

- User
- Property
- Conversation
- Message
- Notification
- Payment
- ConnectionTest

## Authentication

Authentication is implemented using JSON Web Tokens (JWT). To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

You can obtain a token by registering a new user or logging in with an existing user.
