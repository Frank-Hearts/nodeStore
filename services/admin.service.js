const User = require('../models/user.model');

const getAllUsers = async (req, res) => {
    return await User.find().select('-password');

}
module.exports = {getAllUsers};