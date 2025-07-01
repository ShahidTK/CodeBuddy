import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";

dotenv.config();

const connectDB = async () => {
  try {
    
    const mongoURI = `${process.env.MONGODB_URL}/${DB_NAME}`;
    await mongoose.connect(mongoURI, {

});

    console.log(`\nMongoDB connected!! DB HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
