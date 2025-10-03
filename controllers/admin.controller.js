const adminService = require('../services/admin.service');

const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

module.exports = {getAllUsers};