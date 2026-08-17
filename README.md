# Kismet E-Commerce API

A RESTful e-commerce backend built using Node.js, Express.js, MongoDB and Mongoose.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Postman

## Features

### Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT authentication
- Protected routes

### Products

- Get all products
- Get product by ID
- Create product
- Update product
- Delete product

### Orders

- Create order
- Get user's orders
- Get order by ID
- Update order
- Delete order

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get one order |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |

## Authentication

Protected endpoints require:

`Authorization: Bearer <JWT_TOKEN>`

The JWT is obtained through the login endpoint.

## Environment Variables

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/kismetDB
PORT=5000
JWT_SECRET=your_secret_key