import express from "express";
import authRoutes from "./routes/auth.routes.js";
import {connectDB} from "./lib/db.js"
import dotenv from "dotenv"
dotenv.config();
const app=express();

const PORT=process.env.PORT;

app.use("/api/auth", authRoutes);
app.get("/hello", (req, res) => {
    console.log("Hello world");
    res.send("Hello from the server!");
});

app.listen(PORT, ()=> {
    console.log("server is running on port: "+ PORT);
    connectDB();
});

