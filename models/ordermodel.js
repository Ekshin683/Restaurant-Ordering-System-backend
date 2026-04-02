import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
    items: [{
        menuId: {type: mongoose.Schema.Types.ObjectId, ref: "menus", required: true},
        quantity: {type: Number, required: true}
    }],
    totalPrice: {type: Number, required: true},
    status: {type: String, enum: ["pending", "completed", "cancelled"], default: "pending"},
    reviewRating: {type: Number, min: 1, max: 5},
    reviewText: {type: String, trim: true},
    reviewImage: {type: String, trim: true},
    reviewedAt: {type: Date}
}, { timestamps: true });

const orderModel = mongoose.model("orders", orderSchema);

export default orderModel;