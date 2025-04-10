import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

// signup function
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
            console.log(`One new User created: ${newUser.fullName}`)
            res.status(201).json({
                _id: newUser._id, 
                fullName: newUser.fullName, 
                email: newUser.email,
                profilePic: newUser.profilePic,
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

// login function
export const login = async (req, res) => {
    // destructure the request
    const { email, password }= req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const isPasswordCorrect =await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        generateToken(user._id, res);
        console.log(`User logged in successfully: ${user.fullName}`)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch(error){
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: "Internal Server error"})
    }
};

// logout function
export const logout = (req, res) => {
    try{
        console.log(`user logged out successfully`);

        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({ message: "Logged out successfully"});
    } catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
};

// update profile picture function
export const updateProfile = async (req, res) => {
    try{


        const {profilePic} = req.body;
        const userId=req.user._id;

        if(!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }

        // upload the profile pic in cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        
        // update database and retrieve latest user id
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url}, {new: true});
        console.log("profile updated successfully");
        res.status(200).json(updatedUser);
        
    } catch(error){
        console.log("Error in update profile: controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const checkAuth= (req, res) => {
    try{
        console.log("user found")
        res.status(200).json(req.user);
    } catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}