import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log('Mongo URI:', process.env.MONGODB_URL);


export const connectDB= async () => {
    try{
        const conn=await mongoose.connect(`mongodb+srv://shahidvelom99:shahid2001@cluster0.ni4eci5.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0`);
        console.log(`mongoDB connected: ${conn.connection.host}`);
    } catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
    }
}