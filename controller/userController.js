import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password, role, address } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists with this email" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            address: address || '',
            role: role || "user"
        });

        await newUser.save();

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                address: newUser.address,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );

        res.status(200).json({ 
            success: true, 
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        const updateData = {};
        if (typeof name === 'string') updateData.name = name;
        if (typeof email === 'string') updateData.email = email;
        if (typeof address === 'string') updateData.address = address;
        
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully",
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        
        res.status(200).json({ 
            success: true, 
            count: users.length,
            users 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedUser = await userModel.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "User deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};
