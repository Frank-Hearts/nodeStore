const cartService = require('../services/cart.service');

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const cart = await cartService.addToCart(userId, productId, quantity);
        res.status(200).json({message: 'Product added to cart', cart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const viewCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItems = await cartService.viewCart(userId);
        res.status(200).json({ message: "Cart fetched successfully", cartItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletefromCart = async (req, res) => {
    try {
        const cartItemId = req.params.id;
        await cartService.deletefromCart(cartItemId);
        res.status(200).json({ message: "Cart deleted successfully!"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        await cartService.clearCart(userId);
        res.status(200).json({ message: "Cart cleared successfully!"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {addToCart, viewCart, deletefromCart, clearCart};