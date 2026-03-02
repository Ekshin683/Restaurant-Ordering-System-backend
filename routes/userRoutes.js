import express from 'express';
import { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    getAllUsers, 
    deleteUser 
} from '../controller/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Admin only routes
router.get('/all', verifyToken, isAdmin, getAllUsers);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
