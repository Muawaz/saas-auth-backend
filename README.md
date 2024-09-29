# SaaS Auth Backend

This repository contains the authentication and authorization module for an email marketing SaaS application. It provides secure user registration, login, and access control, designed for easy integration with the overall application architecture.

## Features

- User registration with email verification
- Secure login with JWT token generation
- Password reset functionality
- Email confirmation with OTP
- Role-based access control
- CRUD operations for user management
- Integration with email service for notifications
- Robust error handling and validation

## Tech Stack

- Node.js
- Express.js
- Postgres
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Nodemailer for email services

## Project Structure
.
- ├── app.js # Express app setup
- ├── config/ # Configuration files
- ├── constants/ # Constant values used across the app
- ├── controllers/ # Request handlers
- ├── dbconnection/ # Database connection setup
- ├── helpers/ # Utility functions
- ├── middlewares/ # Custom middleware functions
- ├── models/ # Mongoose models
- ├── routes/ # API routes
- ├── services/ # Business logic
- ├── test/ # Test cases
- └── .env # Environment variables (not in repo)

## Setup and Installation

1. Clone the repository:
   git clone https://github.com/Muawaz/saas-auth-backend.git
2. Install dependencies:
   npm install
3. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in the required environment variables
4. Start the server:
   npm start
## API Documentation
### User Registration
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
 "name": "John Doe",
 "email": "john@example.com",
 "password": "securepassword"
}
```
- **Success Response:**:
```json
{
  "status": 200,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "JWT_TOKEN"
  }
}
```
### User Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
- **Success Response:**:
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "JWT_TOKEN"
  }
}
```
### Password Reset Request
- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com"
}
```
- **Success Response:**:
```json
{
  "status": 200,
  "message": "Password reset instructions sent to email"
}
```
## .ENV.EXAMPLE FILE
```
PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
EMAIL_USER=
EMAIL_PASS=
REACT_APP_BASE_URL=

JWT_SECRET=
JWT_MAX_AGE_HRS=

OTP_EXPIRY_MIN=
```
## Testing
#### Run the test suite with the following:
```npm test```
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

#### This README provides a comprehensive overview of the project, its structure, and key API endpoints. Instead of screenshots, I've included example API responses, which are more useful for developers who want to integrate with or understand the API.
