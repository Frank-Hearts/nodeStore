const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const addToCart = async (userId, productId, quantity) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if(product.inStock < quantity){
            throw new Error(`Only ${product.inStock} items in stock`);
        }

        let cartItem = await Cart.findOne({ userId, productId });
                
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            return cartItem;
        }else {
            cartItem = new Cart({ userId, productId, quantity });
            await cartItem.save();
            return cartItem;
        }

    } catch (error) {
        throw new Error('Failed to add to cart: ' + error.message);
    }
};

const viewCart = async(userId) => {
    try{
        const cartItems = await Cart.find({userId}).populate('productId');
        if(cartItems.length === 0){
            throw new Error("Cart is empty!😢");
        }

        let totalAmount = 0;

        cartItems.forEach(item => {
            totalAmount += item.productId.price * item.quantity
        })
        return{cartItems, totalAmount}
    }catch(error){
       throw new Error('Failed to fetch cart: ' + error.message); 
    }
}

const deletefromCart = async(cartItemId) => {
    try{
        const cartItem = await Cart.findById(cartItemId);
        
        if(!cartItem || cartItem.length === 0){
            throw new Error("Cart is empty!😢");
        }
        await Cart.findByIdAndDelete(cartItemId);
    }catch(error){
        throw new Error('Failed to delete cart item!');
    }
}

const clearCart = async(userId) => {
    try{
        // console.log(`The userId is ${userId}`);
        const cartItem = await Cart.find({userId})
        // console.log(`The CartItem is ${cartItem}`);
        if(!cartItem || cartItem.length === 0){
            throw new Error("Cart is already empty!😢");
        }
        await Cart.deleteMany({userId});
        return;
    }catch(error){
        throw new Error("Failed to clear cart!");
    }
}
module.exports = { addToCart, viewCart, deletefromCart, clearCart};