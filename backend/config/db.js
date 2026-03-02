import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/taskforge");
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        process.exit(1);
    }
}