const orderController = require('../controllers/order.controller');
const {auth} = require('../middleware/auth.middleware');
const router = require('express').Router();

router.post('/place-order', auth, orderController.placeOrder);
router.get('/confirm-order', orderController.confirmOrder)

module.exports = router;