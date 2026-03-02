# Restaurant Ordering System - Backend

A complete MERN stack backend application for a Restaurant Ordering System with authentication, authorization, and CRUD operations.

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Role-Based Access Control (User & Admin)
- ✅ CRUD Operations for Menu Items
- ✅ Order Management System
- ✅ Search & Filter Functionality
- ✅ API Validation & Error Handling
- ✅ MVC Folder Structure
- ✅ Secure Password Hashing with bcrypt
- ✅ MongoDB Database Integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Restaurant-Ordering-System-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurantdatabase
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. Make sure MongoDB is running on your system

5. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/profile` | Private | Get user profile |
| PUT | `/profile` | Private | Update user profile |
| GET | `/all` | Admin | Get all users |
| DELETE | `/:id` | Admin | Delete user |

### Menu Routes (`/api/menu`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all menu items (with search/filter) |
| GET | `/categories` | Public | Get all categories |
| GET | `/:id` | Public | Get menu item by ID |
| POST | `/` | Admin | Create new menu item |
| PUT | `/:id` | Admin | Update menu item |
| DELETE | `/:id` | Admin | Delete menu item |

### Order Routes (`/api/orders`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create new order |
| GET | `/` | Private | Get all orders (user's own or all for admin) |
| GET | `/my-orders` | Private | Get user's order history |
| GET | `/:id` | Private | Get order by ID |
| PUT | `/:id/status` | Admin | Update order status |
| DELETE | `/:id` | Admin | Delete order |

## Request Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Menu Item (Admin)
```bash
POST /api/menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "price": 12.99,
  "category": "Pizza",
  "description": "Classic Italian pizza",
  "available": true
}
```

### Search Menu Items
```bash
GET /api/menu?search=pizza&category=Pizza&minPrice=10&maxPrice=20&available=true
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuId": "60d5ec49f1b2c72b8c8e4f1a",
      "quantity": 2
    },
    {
      "menuId": "60d5ec49f1b2c72b8c8e4f1b",
      "quantity": 1
    }
  ]
}
```

### Update Order Status (Admin)
```bash
PUT /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  timestamps: true
}
```

### MenuItem Schema
```javascript
{
  name: String (required),
  price: Number (required),
  category: String (required),
  description: String,
  available: Boolean (default: true),
  timestamps: true
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: "users", required),
  items: [{
    menuId: ObjectId (ref: "menus", required),
    quantity: Number (required)
  }],
  totalPrice: Number (required),
  status: String (enum: ["pending", "completed", "cancelled"], default: "pending"),
  timestamps: true
}
```

## Project Structure

```
Restaurant-Ordering-System-backend/
├── config/
│   └── database.js          # Database connection
├── controller/
│   ├── userController.js    # User authentication & CRUD
│   ├── menuController.js    # Menu CRUD operations
│   └── orderController.js   # Order management
├── middleware/
│   └── auth.js              # JWT authentication & authorization
├── models/
│   ├── usermodel.js         # User schema
│   ├── menumodel.js         # Menu schema
│   └── ordermodel.js        # Order schema
├── routes/
│   ├── userRoutes.js        # User routes
│   ├── menuRoutes.js        # Menu routes
│   └── orderRoutes.js       # Order routes
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── index.js                 # Main server file
├── package.json             # Dependencies & scripts
└── README.md                # Documentation
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/restaurantdatabase |
| JWT_SECRET | Secret key for JWT | (required) |
| NODE_ENV | Environment mode | development |

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (in development)"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Token expires in 24 hours.

## Role-Based Access

- **Public Routes**: Accessible to everyone
- **Private Routes**: Require authentication (any logged-in user)
- **Admin Routes**: Require authentication + admin role

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Production

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Update `MONGO_URI` to production database
4. Run: `npm start`

## License

ISC

## Author

Your Name

---

**Note**: Make sure to change the JWT_SECRET in production to a secure random string!
