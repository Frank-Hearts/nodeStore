const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const {JWT_SECRET} = process.env;

// Middleware to check if a token is valid

const auth = async(req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        return res.status(401).json({error: "No token, authorization denied!"});
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if(!req.user) return res.status(401).json({error: "User not found!"})
        next();
    }catch(error){
        res.status(401).json({error: "Invalid token!"});
    }
}

const adminOnly = (req, res, next) =>{
    if(req.user.role !=='admin'){
        return res.status(403).json({error: "Access denied: Admin only"});
    }
    next();
}

module.exports = {auth, adminOnly}