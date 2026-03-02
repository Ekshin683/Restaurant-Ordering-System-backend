import menuModel from '../models/menumodel.js';

// Create new menu item (Admin only)
export const createMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, imageUrl, available } = req.body;

        // Validation
        if (!name || !price || !category || !imageUrl) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, price, category, and imageUrl are required" 
            });
        }

        const newMenuItem = new menuModel({
            name,
            price,
            category,
            description,
            imageUrl,
            available
        });

        await newMenuItem.save();

        res.status(201).json({ 
            success: true, 
            message: "Menu item created successfully",
            menuItem: newMenuItem 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get all menu items with search and filter
export const getAllMenuItems = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, available } = req.query;
        
        let query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by availability
        if (available !== undefined) {
            query.available = available === 'true';
        }

        const menuItems = await menuModel.find(query).sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: menuItems.length,
            menuItems 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get single menu item by ID
export const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const menuItem = await menuModel.findById(id);
        
        if (!menuItem) {
            return res.status(404).json({ 
                success: false, 
                message: "Menu item not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            menuItem 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Update menu item (Admin only)
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description, imageUrl, available } = req.body;

        const updatedMenuItem = await menuModel.findByIdAndUpdate(
            id,
            { name, price, category, description, imageUrl, available },
            { new: true, runValidators: true }
        );

        if (!updatedMenuItem) {
            return res.status(404).json({ 
                success: false, 
                message: "Menu item not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Menu item updated successfully",
            menuItem: updatedMenuItem 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Delete menu item (Admin only)
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMenuItem = await menuModel.findByIdAndDelete(id);

        if (!deletedMenuItem) {
            return res.status(404).json({ 
                success: false, 
                message: "Menu item not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Menu item deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// Get menu categories
export const getCategories = async (req, res) => {
    try {
        const categories = await menuModel.distinct('category');
        
        res.status(200).json({ 
            success: true, 
            categories 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};
