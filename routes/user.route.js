//const express = require('express');
//const router = express.Router();

const router = require('express').Router();
const userController = require('../controllers/user.controller');
const {auth} = require('../middleware/auth.middleware');

router.patch('/update-profile', auth, userController.updateProfile);
router.get('/profile', auth, userController.getUserProfile);
router.post('/delete-account/request', auth, userController.requestAccountDeletion);
router.post('/confirm-account-deletion/confirm', auth, userController.confirmAccountDeletion);

module.exports = router;