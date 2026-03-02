import orderModel from '../models/ordermodel.js';
import menuModel from '../models/menumodel.js';

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        // Validation
        if (!items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Order must contain at least one item" 
            });
        }

        // Calculate total price
        let totalPrice = 0;
        for (const item of items) {
            const menuItem = await menuModel.findById(item.menuId);
            if (!menuItem) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Menu item ${item.menuId} not found` 
                });
            }
            if (!menuItem.available) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Menu item ${menuItem.name} is not available` 
                });
            }
            totalPrice += menuItem.price * item.quantity;
        }

        const newOrder = new orderModel({
            userId: req.user.id,
            items,
            totalPrice
        });

        await newOrder.save();

        const populatedOrder = await orderModel.findById(newOrder._id)
            .populate('userId', 'name email')
            .populate('items.menuId', 'name price category');

        res.status(201).json({ 
            success: true, 
            message: "Order created successfully",
            order: populatedOrder 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get all orders (Admin gets all, User gets their own)
export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // If not admin, only show user's orders
        if (req.user.role !== "admin") {
            query.userId = req.user.id;
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        const orders = await orderModel.find(query)
            .populate('userId', 'name email')
            .populate('items.menuId', 'name price category')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: orders.length,
            orders 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await orderModel.findById(id)
            .populate('userId', 'name email')
            .populate('items.menuId', 'name price category');

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        // Check if user is authorized to view this order
        if (req.user.role !== "admin" && order.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied" 
            });
        }

        res.status(200).json({ 
            success: true, 
            order 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["pending", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status. Must be pending, completed, or cancelled" 
            });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('userId', 'name email')
         .populate('items.menuId', 'name price category');

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Order status updated successfully",
            order: updatedOrder 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await orderModel.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Order deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get user's order history
export const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user.id })
            .populate('items.menuId', 'name price category')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: orders.length,
            orders 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};
