import User from "../models/user.model.js"

// get all users' data
export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId=req.user._id; // current user
        //remove the current user id
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId }}).select("-password");
        console.log("Users data fetched successfully");
        res.status(200).json(filteredUsers);
    } catch(error){
        console.log("Error in getusersforsidebar: ", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}

// get the chat history
export const getMessages = async (req, res)=>{
    try{
        const {id: userToChatId}=req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            // add both the messages from sender and reciever
            $or: [
                {senderId:myId, recieverId: userToChatId}, 
                {senderId: userToChatId, recieverId: myId}
            ]
        })
        res.status(200).json(messages);

    } catch(error){
        console.log("Error in getmessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}


// send message
export const sendMessage = async (req, res) => {
    try{
        const {text, image}= req.body;
        const { id: recieverId} = req.params;
        const senderId = req.user._id;

        let  imageUrl;
        if(image){
        // upload base_64 image to cloudinary
        const uploadResponse= await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
        }

        // add to message database
        const newMessage = new Message({
            senderId, 
            recieverId, 
            text, 
            image: imageUrl,
        });

        // todo: socket io

        console.log("Message sent successfully");
        res.status(201).json(newMessage);

    } catch(error){
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}