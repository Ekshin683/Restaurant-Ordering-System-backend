import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true}, // e.g. Biryani, Fast Food, Indian, Chinese, Dessert, Beverages, Snacks
    description: {type: String},
    imageUrl: {type: String, required: true},
    available: {type: Boolean, default: true}
}, { timestamps: true });

const menuModel = mongoose.model("menus", menuSchema);
export default menuModel;