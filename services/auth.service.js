const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Token = require("../models/token.model");
const MailService = require('./mail.service');
dotenv.config();


const {JWT_SECRET} = process.env;

const registerUser = async({fullName, email, password, role}) => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'user',
    })

    await newUser.save();

    const code = ("" + Math.floor(1000 + Math.random() * 9000))
    
    await Token.create({
        userId: newUser._id,
        code
    })


    await MailService.sendVerificationEmail(email, fullName, code)
    return newUser;
}

const verifyEmail = async({email, token}) => {
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found");

    const tokenDoc = await Token.findOne({userId: user._id, code: token});
    if(!tokenDoc) throw new Error("Invalid or expired token");

    user.isVerified = true;
    await user.save();
    await Token.deleteOne({userId: user._id});
    return;
}

const resendEmailToken = async(email) => {
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found");
    if(user.isVerified === true) throw new Error("This email is already verified");

    const tokenDoc = await Token.findOne({userId: user._id});
    if(tokenDoc){
        await Token.deleteOne({userId: user._id});
    }

    const code = ("" + Math.floor(1000 + Math.random() * 9000))
    
    await Token.create({
        userId: user._id,
        code
    })
    await MailService.sendVerificationEmail(email, user.fullName, code);
    return;
}

const requestPasswordReset = async(email) =>{
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found");

    await Token.deleteMany({userId: user._id});
    const code = ("" + Math.floor(1000 + Math.random() * 9000))
    await Token.create({
        userId: user._id,
        code
    });
    await MailService.sendPasswordResetEmail(email, user.fullName, code);
    return;
}

const resetPassword = async({email, token, newPassword}) => {
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found");

    const tokenDoc = await Token.findOne({userId: user._id, code: token});
    if(!tokenDoc) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await Token.deleteOne({userId: user._id});
    return;
}

const loginUser = async({email, password}) => {
    const user = await User.findOne({email});

    if(!user) throw new Error("No user exists with this email");

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid Password");

    if(user.isVerified == false){
        throw new Error("Please verify your email");
    }
    const token = jwt.sign(
        {id: user._id, email: user.email},
        JWT_SECRET,
        {expiresIn: '1h'}
    );

    return{user, token};
}
module.exports = {registerUser, loginUser, verifyEmail, resendEmailToken, requestPasswordReset, resetPassword}