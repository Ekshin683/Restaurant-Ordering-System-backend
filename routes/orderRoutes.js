import express from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus, 
    deleteOrder,
    getUserOrders 
} from '../controller/orderController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getAllOrders);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/:id', verifyToken, getOrderById);

// Admin only routes
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

export default router;
