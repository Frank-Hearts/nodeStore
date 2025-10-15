const express = require('express');
const dotenv = require('dotenv');
const dbconnect = require('./config/db.config');
const cors = require("cors")

dotenv.config();

dbconnect();

const app = express();
app.use(cors());
app.use(express.json());

// const{PORT} = process.env
const {PORT, JWT_SECRET} = process.env;

app.use("/api", require("./routes"));

// register endpoint\

// app.post("/register", async(req, res) => {
//     try{
//         const{fullName, email, password, role} = req.body;

//         if(!fullName || !email || !password){
//             return res.status(400).json({message: "Please fill all required fields"});
//         }

//         const existingUser = await User.findOne({email});
//         if(existingUser){
//             return res.status(400).json({message: `User already exists with this email:${email}`});
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             fullName,
//             email,
//             password: hashedPassword,
//             role: role || 'user',
//         });
//         await newUser.save();
//         res.status(201).json({message: "User registered successfully", user: newUser});
//     }catch(error){
//         res.status(500).json({message:"Server Error", error: error.message});
//     }
// })

// login endpoint
// app.post("/login", async(req, res) => {
//     try{
//         const {email, password} = req.body;

//         if(!email || !password){
//             return res.status(400).json({message: "Email and password are required"});
//         }
//         const user = await User.findOne({email});
//         if(!user){
//             return res.status(400).json({message: "Invalid Email"});
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if(!isPasswordValid){
//             return res.status(400).json({message: "Invalid Password"});
//         }

//         const token = jwt.sign(
//             {id: user._id, email: user.email},
//             JWT_SECRET,
//             {expiresIn: '1h'}
//         )
//         res.status(200).json({message: "Login successful", token, user});
//     }catch{
//         res.status(500).json({message: "Server Error", error: error.message});
//     }
// })

// app.get("/profile", auth, async(req, res) => {
//     res.json({message: "Welcome to nodeAuth application"});
// })


app.listen(PORT, () => {
    console.log(`server is runnning on http:localhost:${PORT}`)
});