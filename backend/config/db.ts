import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/invoiceloop'
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Database Connection Error: ${message}`);
        process.exit(1);
    }
};

export default connectDB;
