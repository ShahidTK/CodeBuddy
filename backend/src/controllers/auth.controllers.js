import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {fullName, email,password }= req.body;
    try{

        if(!fullName || !email || !password){
            res.status(400).json({ message: "All fields are required "});
        }
        
        // check length of the password
        if(password.length<8) {
            return res.status(400).json({message: "Password must be at least  8 characters"});
        }
        
        // check whether exists or not
        const user= await User.findOne({email});
        
        if(user) return res.status(400).json({
            message: "Email already exists"
        });
        
        // hash the password
        // eg. 12345 -> djflkdjf47gjkd
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        

        // create a new user
        const newUser = new User({
            fullName, 
            email, 
            password:hashedPassword
        }); 
        
        if(newUser){
        // create jwt token
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id, 
                fullName: newUser.fullName, 
                email: newUser.email,
                profilePic: newUser>profilePic,
            })

        } else{
            res.status(400).json({ message: "Invalid user data" });
        }

    }  catch(error){
        // error in signup
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
};

export const login = (req, res) => {
    res.send("Login logic here");
};

export const logout = (req, res) => {
    res.send("Logout logic here");
};