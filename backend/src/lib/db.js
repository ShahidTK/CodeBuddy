import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// console.log('Mongo URI:', process.env.MONGODB_URL);


export const connectDB= async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`mongoDB connected: ${conn.connection.host}`);
    } catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
    }
}