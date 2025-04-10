import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next ) => {
    try{
        const token= req.cookies.jwt;

        // if no token provided
         if(!token) {
            return res.status(400).json({ message: "Unauthorized - No token provided "});
         }
         
         // decode the jwt token using the same secret key
         const decoded=jwt.verify(token, process.env.JWT_SECRET);

         if(!decoded){
            return res.status(401).json({ message: "Unauthorized - No token provided"})
         }

         const user = await User.findById(decoded.userId).select("-password");

         // if no user found
         if(!user){
            return res.status(401).json({ message: "No user found"})
         }

         // add the user to the req body
         req.user = user
         next()

    } catch(error){
        console.log("Error in protectedRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server Error"});
    }
}