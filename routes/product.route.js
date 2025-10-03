const router = require('express').Router();
const productController = require('../controllers/product.controller');
const {auth, adminOnly} = require('../middleware/auth.middleware');
const upload = require('../middleware/cloudinary.middleware');

router.post('/create-product', auth, adminOnly, upload.single('image'), productController.createProduct);
router.get('/get-products', productController.getAllProducts);
router.get('/get-product/:id', productController.getProductById);
router.delete('/delete-product/:id', auth, adminOnly, productController.deleteProductById);
router.patch('/update-product/:id', auth, adminOnly, upload.single('image'), productController.updateProduct);
router.get('/search', productController.searchProducts);

module.exports = router;