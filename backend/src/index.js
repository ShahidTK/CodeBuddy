import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/db.js"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

//initialize app
const app=express();

const PORT=process.env.PORT;

// to extract json data out of body
app.use(express.json()) 

// to parse the cookies
app.use(cookieParser())

// for cross origin api calls
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
// call the api of auth to process authentication
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// for testing
app.get("/hello", (req, res) => {
    console.log("Hello world");
    res.send("Hello from the server!");
});

// connect to the data base
app.listen(PORT, ()=> {
    console.log("server is running on port: "+ PORT);
    connectDB();
});

