const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { MONGO_LOCAL_URL, MONGO_PROD_URL} = process.env


const dbconnect = async() => {
    try{
        await mongoose.connect(MONGO_PROD_URL);
        console.log("✅ MongoDb connected sucessfully");
    }catch(error){
        console.log("MongoDb connection failed", error);
    }
}
module.exports = dbconnect;