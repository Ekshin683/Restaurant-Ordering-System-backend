# API Testing Guide

## Quick Start

1. **Start MongoDB** (if not already running)
2. **Seed the database** with sample data:
   ```bash
   npm run seed
   ```
3. **Start the server**:
   ```bash
   npm run dev
   ```

## Default Credentials (After Seeding)

- **Admin**: 
  - Email: `admin@restaurant.com`
  - Password: `admin123`

- **User**: 
  - Email: `john@example.com`
  - Password: `user123`

## Testing with cURL

### 1. User Registration
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 2. User Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "admin123"
  }'
```
**Save the token from the response!**

### 3. Get All Menu Items
```bash
curl http://localhost:5000/api/menu
```

### 4. Search Menu Items
```bash
# Search by name
curl "http://localhost:5000/api/menu?search=pizza"

# Filter by category
curl "http://localhost:5000/api/menu?category=Pizza"

# Filter by price range
curl "http://localhost:5000/api/menu?minPrice=10&maxPrice=15"

# Combined filters
curl "http://localhost:5000/api/menu?search=burger&category=Burger&maxPrice=12"
```

### 5. Create Menu Item (Admin Only)
**Replace YOUR_TOKEN with the actual token from login**
```bash
curl -X POST http://localhost:5000/api/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Veggie Pizza",
    "price": 13.99,
    "category": "Pizza",
    "description": "Loaded with fresh vegetables",
    "available": true
  }'
```

### 6. Update Menu Item (Admin Only)
**Replace MENU_ID with actual menu item ID**
```bash
curl -X PUT http://localhost:5000/api/menu/MENU_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "price": 15.99,
    "available": false
  }'
```

### 7. Create Order (Authenticated User)
**Replace MENU_ID1 and MENU_ID2 with actual menu item IDs**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "menuId": "MENU_ID1",
        "quantity": 2
      },
      {
        "menuId": "MENU_ID2",
        "quantity": 1
      }
    ]
  }'
```

### 8. Get All Orders
```bash
# User sees their own orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl "http://localhost:5000/api/orders?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. Get User's Order History
```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10. Update Order Status (Admin Only)
**Replace ORDER_ID with actual order ID**
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

### 11. Get User Profile
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 12. Delete Menu Item (Admin Only)
**Replace MENU_ID with actual menu item ID**
```bash
curl -X DELETE http://localhost:5000/api/menu/MENU_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing with Postman or Thunder Client

### Setup
1. Create a new request collection
2. Set base URL variable: `http://localhost:5000`
3. After login, save the token and use it in Authorization header: 
   - Type: Bearer Token
   - Token: `your-jwt-token`

### Import this Postman Collection

Create a file `postman_collection.json` with the following structure:

```json
{
  "info": {
    "name": "Restaurant Ordering System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## Common Test Scenarios

### Scenario 1: Complete User Flow
1. Register new user
2. Login to get token
3. Browse menu items
4. Create an order
5. View order history
6. Check order status

### Scenario 2: Admin Flow
1. Login as admin
2. Create new menu items
3. View all orders
4. Update order status to "completed"
5. View all users

### Scenario 3: Search & Filter
1. Search for "pizza"
2. Filter by category "Burger"
3. Filter by price range $5-$15
4. Combine multiple filters

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Server Error

## Tips

1. **Always save your JWT token** after login - you'll need it for authenticated requests
2. **Token expires in 24 hours** - login again if expired
3. **Admin privileges** required for:
   - Creating/updating/deleting menu items
   - Viewing all users
   - Updating order status
   - Deleting orders
4. **Use MongoDB Compass** to view database directly
5. **Check server console** for detailed error messages

## Testing Validation

### Test Invalid Requests
```bash
# Missing required fields
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Invalid email format
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "test123"}'

# Unauthorized access (no token)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": []}'
```

## Database Direct Access

Using MongoDB Compass or Mongo Shell:

```javascript
// Connect to: mongodb://localhost:27017/restaurantdatabase

// View all collections
show collections

// View all users
db.users.find()

// View all menu items
db.menus.find()

// View all orders with populated data
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
])
```

## Troubleshooting

### Issue: "Database connection error"
- Make sure MongoDB is running
- Check MONGO_URI in .env file

### Issue: "Invalid token"
- Login again to get a fresh token
- Check if token is properly formatted in Authorization header

### Issue: "Access denied. Admin privileges required"
- Make sure you're logged in as admin user
- Use admin@restaurant.com / admin123 credentials

### Issue: "Menu item not found"
- Run `npm run seed` to populate database
- Use valid menu item IDs from the database
