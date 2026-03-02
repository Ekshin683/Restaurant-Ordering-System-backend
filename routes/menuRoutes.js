import express from 'express';
import { 
    createMenuItem, 
    getAllMenuItems, 
    getMenuItemById, 
    updateMenuItem, 
    deleteMenuItem,
    getCategories 
} from '../controller/menuController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Admin only routes
router.post('/', verifyToken, isAdmin, createMenuItem);
router.put('/:id', verifyToken, isAdmin, updateMenuItem);
router.delete('/:id', verifyToken, isAdmin, deleteMenuItem);

export default router;
