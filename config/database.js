import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || (process.env.NODE_ENV !== 'production' ? 'mongodb://localhost:27017/restaurantdatabase' : '');

        if (!mongoUri) {
            throw new Error('MONGO_URI is required in production environment');
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

export default dbConnect;