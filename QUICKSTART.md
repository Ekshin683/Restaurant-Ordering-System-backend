# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB installed and running
- Terminal/Command Prompt

## Steps to Run the Application

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Configure Environment
The `.env` file is already created with default settings:
- Port: 5000
- MongoDB: localhost:27017
- Database: restaurantdatabase

**Optional**: Edit `.env` if you need custom configuration

### 3. Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should be running as a service
# Check with: services.msc (look for MongoDB)
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### 4. Seed the Database (IMPORTANT - First Time)
```bash
npm run seed
```

This will create:
- ✅ Admin user: `admin@restaurant.com` / `admin123`
- ✅ Test user: `john@example.com` / `user123`
- ✅ 10 sample menu items

### 5. Start the Server
```bash
npm run dev
```

You should see:
```
Database connected successfully
Server is running on port 5000
```

### 6. Test the API

**Option 1: Using Browser**
- Open: http://localhost:5000
- You should see: `{"success": true, "message": "Restaurant Ordering System API is running"}`

**Option 2: Using cURL (Get Menu Items)**
```bash
curl http://localhost:5000/api/menu
```

**Option 3: Login to Get Token**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@restaurant.com\",\"password\":\"admin123\"}"
```

### 7. Explore the API
- See [API_TESTING.md](API_TESTING.md) for detailed testing guide
- Use Postman, Thunder Client, or cURL
- Check [README.md](README.md) for complete documentation

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env` | Configuration (port, database, secrets) |
| `seed.js` | Sample data generator |
| `index.js` | Main server file |
| `README.md` | Full documentation |
| `API_TESTING.md` | Testing guide |
| `PROJECT_STRUCTURE.md` | Architecture details |

## 🎯 Quick Test Workflow

1. **Seed database**: `npm run seed`
2. **Start server**: `npm run dev`
3. **Login as admin**: 
   ```bash
   POST http://localhost:5000/api/users/login
   Body: {"email":"admin@restaurant.com","password":"admin123"}
   ```
4. **Get menu**: 
   ```bash
   GET http://localhost:5000/api/menu
   ```
5. **Create order** (use token from login):
   ```bash
   POST http://localhost:5000/api/orders
   Header: Authorization: Bearer YOUR_TOKEN
   Body: {"items":[{"menuId":"MENU_ITEM_ID","quantity":2}]}
   ```

## 🛠️ Available Scripts

```bash
npm start      # Run production server
npm run dev    # Run development server (auto-reload)
npm run seed   # Seed database with sample data
```

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Dependencies installed (`npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Server started (`npm run dev`)
- [ ] API responds at http://localhost:5000
- [ ] Can login and get JWT token
- [ ] Can fetch menu items

## 🐛 Troubleshooting

### Issue: "MongoServerError: connect ECONNREFUSED"
**Solution**: Start MongoDB service
```bash
# Windows: Check services.msc
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"
**Solution**: Change port in `.env` file
```env
PORT=3000
```

### Issue: "Cannot find module 'dotenv'"
**Solution**: Install dependencies
```bash
npm install
```

### Issue: "User not found" when logging in
**Solution**: Seed the database first
```bash
npm run seed
```

## 📱 Connect Frontend (When Ready)

When you build the React frontend:

1. Update CORS in `index.js` if needed:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'  // Your React app URL
}));
```

2. Use these endpoints in your React app:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 🎉 You're All Set!

Your Restaurant Ordering System backend is now fully functional with:
- ✅ User Authentication (JWT)
- ✅ Menu Management (CRUD)
- ✅ Order System (Full workflow)
- ✅ Role-Based Access (User/Admin)
- ✅ Search & Filter
- ✅ Error Handling
- ✅ API Validation

**Next Steps**: Start building your React frontend! 🚀

---

**Need Help?** Check the documentation files:
- 📖 [README.md](README.md) - Full documentation
- 🧪 [API_TESTING.md](API_TESTING.md) - API testing guide
- 🏗️ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture
