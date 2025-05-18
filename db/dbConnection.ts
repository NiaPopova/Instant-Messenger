import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://webtex_user:HoS07qMyxfJPRArf@webtex.zx17a.mongodb.net/webtex?retryWrites=true&w=majority&appName=Webtex';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(' MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
