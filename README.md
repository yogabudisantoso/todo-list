## API Documentation
Interactive API documentation is available at http://localhost:3000/api-docs when the server is running.

The documentation provides detailed information about all endpoints, request parameters, and response formats.

## Features
- User authentication (register, login) with JWT
- CRUD operations for todo items
- Pagination for listing items
- Input validation and error handling
- Protected routes with authentication middleware
- Interactive API documentation with Swagger

## Technologies Used
- Node.js
- Express.js
- MySQL
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation
- Swagger for API documentation

## Prerequisites
- Node.js (v14 or higher)
- MySQL server

## Installation
1. Clone the repository:
```bash
git clone https://github.com/yogabudisantoso/todo-list.git
cd talent-growth

### Link Swagger API Documentation
- https://app.swaggerhub.com/apis-docs/YOGABUDISANTOSO25/talent-growth_api/1.0.0

=======
### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login a user
- GET /auth/profile - Get user profile (protected)
### Todo Items
- GET /items - Get all items with pagination (protected)
- GET /items/:id - Get a specific item (protected)
- POST /items - Create a new item (protected)
- PUT /items/:id - Update an item (protected)
- DELETE /items/:id - Delete an item (protected)

### Link Swagger API Documentation
- https://app.swaggerhub.com/apis-docs/YOGABUDISANTOSO25/talent-growth_api/1.0.0
