const userService = require('../services/user.service');
//const User = require('../models/user.model');
//const Token = require('../models/token.model');

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        //console.log(`the id of the user is ${userId}`);
        const updateData = req.body;

        const updatedUser = await userService.updateUserProfile(userId, updateData);
        res.json({message: "Profile updated successfully"});
        
        //const {fullName,phone, address} = req.body;
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const getUserProfile = async(req, res) => {
    const userId = req.user._id;
    try{
        const userProfile = await userService.getUserProfile(userId);
        res.json({message: "User profile fetched successfully", data: userProfile});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const requestAccountDeletion = async(req, res) => {
    const userId = req.user._id;
    try{
        await userService.requestAccountDeletion(userId);
        res.json({message: "Account deletion request received and a delete token has been sent to your email."});
        // Here, you would typically create a record in a separate collection
        // to track deletion requests, send an email to the user, etc.

    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const confirmAccountDeletion = async(req, res) => {
    try{
        const userId = req.user._id;
        const {deleteToken} = req.body;

        if(!deleteToken) return res.status(400).json({message: "Delete token is required"});
        const user = await userService.confirmAccountDeletion(userId, deleteToken);

        console.log(`the user to be deleted is ${userId}`);
        
        res.status(200).json({message: "Account deleted successfully"});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}
module.exports = {updateProfile, getUserProfile, requestAccountDeletion, confirmAccountDeletion};