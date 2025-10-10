const router = require('express').Router();
const cartController = require('../controllers/cart.controller');
const {auth} = require('../middleware/auth.middleware');

router.post('/add-to-cart', auth, cartController.addToCart);
router.get('/view-cart', auth, cartController.viewCart);
router.delete('/delete-cart/:id', auth, cartController.deletefromCart);
router.delete('/clear-cart', auth, cartController.clearCart);


module.exports = router;