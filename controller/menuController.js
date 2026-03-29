import menuModel from '../models/menumodel.js';

// Create new menu item (Admin only)
export const createMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, imageUrl, available } = req.body;

        // Validation - make imageUrl optional with default value
        if (!name || !price || !category) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, price, and category are required fields" 
            });
        }

        // Validate price is a number
        if (isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Price must be a valid positive number" 
            });
        }

        const newMenuItem = new menuModel({
            name: name.trim(),
            price: Number(price),
            category: category.trim(),
            description: description ? description.trim() : '',
            imageUrl: imageUrl ? imageUrl.trim() : 'https://via.placeholder.com/300x200?text=No+Image',
            available: available !== false // Default to true if not specified
        });

        await newMenuItem.save();

        res.status(201).json({ 
            success: true, 
            message: "Menu item created successfully",
            menuItem: newMenuItem 
        });
    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to create menu item", 
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
        console.error('Get all menu items error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch menu items", 
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
        console.error('Get menu item by ID error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch menu item", 
            error: error.message 
        });
    }
};

// Update menu item (Admin only)
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description, imageUrl, available } = req.body;

        // Build update object with only provided fields
        const updateData = {};
        
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ success: false, message: "Name cannot be empty" });
            }
            updateData.name = name.trim();
        }
        
        if (price !== undefined) {
            if (isNaN(price) || Number(price) <= 0) {
                return res.status(400).json({ success: false, message: "Price must be a valid positive number" });
            }
            updateData.price = Number(price);
        }
        
        if (category !== undefined) {
            if (!category.trim()) {
                return res.status(400).json({ success: false, message: "Category cannot be empty" });
            }
            updateData.category = category.trim();
        }
        
        if (description !== undefined) {
            updateData.description = description ? description.trim() : '';
        }
        
        if (imageUrl !== undefined) {
            updateData.imageUrl = imageUrl ? imageUrl.trim() : 'https://via.placeholder.com/300x200?text=No+Image';
        }
        
        if (available !== undefined) {
            updateData.available = Boolean(available);
        }

        const updatedMenuItem = await menuModel.findByIdAndUpdate(
            id,
            updateData,
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
        console.error('Update menu item error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update menu item", 
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
            message: "Menu item deleted successfully",
            menuItem: deletedMenuItem
        });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete menu item", 
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
        console.error('Get categories error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch categories", 
            error: error.message 
        });
    }
};
