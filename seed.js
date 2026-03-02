import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userModel from './models/usermodel.js';
import menuModel from './models/menumodel.js';

dotenv.config();

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/restaurantdatabase");
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

// Sample data
const users = [
    {
        name: "Admin User",
        email: "admin@restaurant.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "John Doe",
        email: "john@example.com",
        password: "user123",
        role: "user"
    }
];

const menuItems = [
    {
        name: "Hyderabadi Biryani",
        price: 15.99,
        category: "Biryani",
        description: "Authentic Hyderabadi biryani with aromatic spices and tender chicken.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Paneer Butter Masala",
        price: 13.99,
        category: "Indian",
        description: "Creamy paneer curry cooked in rich tomato gravy.",
        imageUrl: "https://images.unsplash.com/photo-1604908177522-432c5c2b8a8e?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Veg Manchurian",
        price: 11.99,
        category: "Chinese",
        description: "Crispy vegetable balls tossed in spicy Chinese sauce.",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Chicken 65",
        price: 12.99,
        category: "Fast Food",
        description: "Spicy deep-fried chicken bites, South Indian style.",
        imageUrl: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Masala Dosa",
        price: 9.99,
        category: "South Indian",
        description: "Crispy rice crepe stuffed with spicy potato filling.",
        imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Samosa",
        price: 4.99,
        category: "Snacks",
        description: "Deep-fried pastry filled with spicy potato and peas.",
        imageUrl: "https://images.unsplash.com/photo-1505250463726-0d238b6b09b0?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Butter Naan",
        price: 3.99,
        category: "Indian",
        description: "Soft and fluffy Indian bread topped with butter.",
        imageUrl: "https://images.unsplash.com/photo-1600628422019-6c1e6b6b9b0e?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Gulab Jamun",
        price: 5.99,
        category: "Dessert",
        description: "Sweet milk dumplings soaked in rose-flavored syrup.",
        imageUrl: "https://images.unsplash.com/photo-1603079841834-1b7b7b7b7b7b?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Cold Coffee",
        price: 4.99,
        category: "Beverages",
        description: "Chilled coffee blended with milk and ice.",
        imageUrl: "https://images.unsplash.com/photo-1464306076886-debede6b2b47?auto=format&fit=crop&w=600&q=80",
        available: true
    },
    {
        name: "Pav Bhaji",
        price: 10.99,
        category: "Fast Food",
        description: "Spicy mashed vegetable curry served with buttered buns.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
        available: true
    }
];

// Seed function
const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await userModel.deleteMany({});
        await menuModel.deleteMany({});
        console.log("Cleared existing data");

        // Hash passwords and create users
        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );

        await userModel.insertMany(hashedUsers);
        console.log("✓ Users seeded successfully");
        console.log("Admin credentials: admin@restaurant.com / admin123");
        console.log("User credentials: john@example.com / user123");

        // Create menu items
        await menuModel.insertMany(menuItems);
        console.log("✓ Menu items seeded successfully");

        console.log("\n✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

// Run seeder
seedData();
