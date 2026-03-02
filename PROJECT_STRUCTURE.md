# Restaurant Ordering System - Project Structure

## 📁 Complete File Structure

```
Restaurant-Ordering-System-backend/
│
├── 📁 config/
│   └── database.js                 # MongoDB connection configuration
│
├── 📁 controller/
│   ├── userController.js          # User authentication & management
│   ├── menuController.js          # Menu CRUD operations
│   └── orderController.js         # Order management
│
├── 📁 middleware/
│   └── auth.js                    # JWT authentication & authorization
│
├── 📁 models/
│   ├── usermodel.js              # User schema definition
│   ├── menumodel.js              # Menu item schema
│   └── ordermodel.js             # Order schema
│
├── 📁 routes/
│   ├── userRoutes.js             # User API routes
│   ├── menuRoutes.js             # Menu API routes
│   └── orderRoutes.js            # Order API routes
│
├── 📁 node_modules/              # Dependencies (auto-generated)
│
├── .env                          # Environment variables (private)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── API_TESTING.md                # API testing guide
├── index.js                      # Main server entry point
├── package.json                  # Project dependencies & scripts
├── package-lock.json             # Locked dependencies
├── README.md                     # Project documentation
└── seed.js                       # Database seeding script
```

## 📋 File Descriptions

### Configuration Files

#### `config/database.js`
- MongoDB connection setup
- Error handling for database connection
- Uses environment variables for connection string
- Graceful exit on connection failure

### Models (Database Schemas)

#### `models/usermodel.js`
- User schema with name, email, password, role
- Role-based access (user/admin)
- Automatic timestamps (createdAt, updatedAt)
- Email uniqueness constraint

#### `models/menumodel.js`
- Menu item schema with name, price, category
- Additional fields: description, availability
- Automatic timestamps
- Used for restaurant menu items

#### `models/ordermodel.js`
- Order schema linking users and menu items
- Array of ordered items with quantities
- Total price calculation
- Order status tracking (pending/completed/cancelled)
- References to User and Menu models

### Middleware

#### `middleware/auth.js`
- `verifyToken()`: JWT token validation
- `isAdmin()`: Admin role verification
- Protects routes from unauthorized access
- Extracts user info from token

### Controllers (Business Logic)

#### `controller/userController.js`
**Functions:**
- `register()`: Create new user account
- `login()`: Authenticate user and issue JWT
- `getProfile()`: Get logged-in user's profile
- `updateProfile()`: Update user information
- `getAllUsers()`: Admin - get all users
- `deleteUser()`: Admin - delete user account

#### `controller/menuController.js`
**Functions:**
- `createMenuItem()`: Admin - add new menu item
- `getAllMenuItems()`: Get all items with search/filter
- `getMenuItemById()`: Get single menu item
- `updateMenuItem()`: Admin - update menu item
- `deleteMenuItem()`: Admin - remove menu item
- `getCategories()`: Get all unique categories

**Features:**
- Search by name (case-insensitive)
- Filter by category
- Filter by price range (min/max)
- Filter by availability

#### `controller/orderController.js`
**Functions:**
- `createOrder()`: Create new order with items
- `getAllOrders()`: Get orders (user's own or all for admin)
- `getOrderById()`: Get single order details
- `updateOrderStatus()`: Admin - update order status
- `deleteOrder()`: Admin - delete order
- `getUserOrders()`: Get user's order history

**Features:**
- Automatic total price calculation
- Menu item availability check
- Population of related data (user, menu items)
- Authorization checks

### Routes (API Endpoints)

#### `routes/userRoutes.js`
| Route | Method | Access | Function |
|-------|--------|--------|----------|
| `/register` | POST | Public | Register user |
| `/login` | POST | Public | Login user |
| `/profile` | GET | Private | Get profile |
| `/profile` | PUT | Private | Update profile |
| `/all` | GET | Admin | Get all users |
| `/:id` | DELETE | Admin | Delete user |

#### `routes/menuRoutes.js`
| Route | Method | Access | Function |
|-------|--------|--------|----------|
| `/` | GET | Public | Get all menu items |
| `/categories` | GET | Public | Get categories |
| `/:id` | GET | Public | Get menu item |
| `/` | POST | Admin | Create menu item |
| `/:id` | PUT | Admin | Update menu item |
| `/:id` | DELETE | Admin | Delete menu item |

#### `routes/orderRoutes.js`
| Route | Method | Access | Function |
|-------|--------|--------|----------|
| `/` | POST | Private | Create order |
| `/` | GET | Private | Get orders |
| `/my-orders` | GET | Private | Get user orders |
| `/:id` | GET | Private | Get order |
| `/:id/status` | PUT | Admin | Update status |
| `/:id` | DELETE | Admin | Delete order |

### Main Files

#### `index.js`
- Express server configuration
- Middleware setup (CORS, JSON parsing)
- Database connection initialization
- Route mounting
- Error handling
- 404 handler
- Server start on specified port

#### `seed.js`
- Database seeding utility
- Creates sample users (admin & regular user)
- Creates sample menu items (10 items)
- Hashes passwords before storage
- Clears existing data before seeding
- Useful for development and testing

### Configuration Files

#### `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurantdatabase
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

#### `.env.example`
Template for environment variables

#### `package.json`
**Scripts:**
- `npm start`: Run production server
- `npm run dev`: Run development server with nodemon
- `npm run seed`: Seed database with sample data
- `npm test`: Run tests (not configured yet)

**Dependencies:**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `nodemon`: Auto-restart development server

## 🔑 Key Features Implemented

### ✅ Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (User/Admin)
- Token expiration (24 hours)
- Protected routes middleware

### ✅ User Management
- User registration with validation
- Secure login system
- Profile viewing and updating
- Admin user management

### ✅ Menu Management
- Full CRUD operations (Admin)
- Public menu browsing
- Search functionality (by name)
- Multi-filter support (category, price, availability)
- Category listing

### ✅ Order System
- Create orders with multiple items
- Automatic price calculation
- Menu item availability validation
- Order status management
- User order history
- Admin order management

### ✅ Data Validation
- Required field validation
- Email format validation
- Password security
- Mongoose schema validation
- Price range validation
- Status enum validation

### ✅ Error Handling
- Global error handler
- 404 route handler
- Try-catch blocks in all controllers
- Meaningful error messages
- Proper HTTP status codes

### ✅ Database Design
- Proper schema relationships
- Reference population for related data
- Indexes for performance (unique email)
- Timestamps on all models
- Enum constraints for status fields

## 🚀 API Features

### Search & Filter
```
GET /api/menu?search=pizza
GET /api/menu?category=Burger
GET /api/menu?minPrice=10&maxPrice=20
GET /api/menu?search=pizza&category=Pizza&available=true
```

### Pagination Ready
Structure supports easy pagination implementation:
```javascript
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;
query.skip(skip).limit(limit);
```

### Sorting
Currently sorted by creation date (newest first):
```javascript
.sort({ createdAt: -1 })
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure, expiring tokens
3. **Environment Variables**: Sensitive data protection
4. **CORS**: Cross-origin protection
5. **Validation**: Input validation on all routes
6. **Authorization**: Role-based access control

## 📊 Database Schema Relationships

```
User ──────┐
           │
           ├──> Order ──┐
           │            │
Menu ──────┴────────────┘
```

- **User** can have many **Orders** (1:N)
- **Menu** items can be in many **Orders** (N:N through items array)
- **Order** belongs to one **User** (N:1)
- **Order** contains many **Menu** items (N:N)

## 🧪 Testing Support

- Database seeding script for test data
- Sample admin and user accounts
- 10 sample menu items across categories
- API testing guide with cURL examples
- Ready for Postman/Thunder Client

## 📝 Documentation

- **README.md**: Complete project documentation
- **API_TESTING.md**: Testing guide with examples
- **PROJECT_STRUCTURE.md**: This file - architecture overview
- Inline code comments throughout
- Clear function naming and structure

## 🎯 MVC Architecture

```
Request → Routes → Middleware → Controllers → Models → Database
                      ↓
                   Response
```

1. **Routes**: Define API endpoints
2. **Middleware**: Authentication/Authorization
3. **Controllers**: Business logic
4. **Models**: Data structure and validation
5. **Database**: MongoDB storage

## 🔧 Deployment Ready

- Environment variable configuration
- Production-ready error handling
- MongoDB connection pooling
- CORS configuration
- Scalable folder structure
- Easy to containerize (Docker ready)

## 📈 Future Enhancements (Optional)

- [ ] Pagination implementation
- [ ] Image upload for menu items
- [ ] Payment integration
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Rating and reviews
- [ ] Coupon/Discount system
- [ ] Real-time order updates (WebSocket)
- [ ] Multiple restaurants support
- [ ] Delivery tracking

---

**All core MERN backend requirements completed! ✅**
