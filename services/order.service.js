const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const {initializePayment, verifyPayment} = require('./payment.service');
const Product = require('../models/product.model')

const placeOrder = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found!');
    }

    if(!user.address || !user.phone){
        throw new Error('Please update your address before placing an order')
    }

       const cartItems = await Cart.find({userId}).populate('productId');
        if(cartItems.length === 0) throw new Error("Cart is empty!😢");

    const totalAmount = cartItems.reduce((sum, item) => {
        const price = item.productId.price || 0;
        return sum + price * item.quantity;
    }, 0)

    const paymentData = {
        tx_ref: `tx-${Date.now()}`,
        amount: totalAmount,
        currency: "NGN",
        redirect_url: `${process.env.BACKEND_DEV_URL}/order/confirm-order`,
        customer: {
            email: user.email,
            phoneNumber: user.phone,
            name: user.fullName
        },
        customizations: {
            title: "Order Payment",
            description: "Payment for items in cart",
            logo: "https://yourdomain.com/logo.png"
        }
    }
    
    const paymentResponse = await initializePayment(paymentData);

    const order = await Order.create({
        userId,
        products: cartItems.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
        })),
        totalAmount,
        paymentRef: paymentData.tx_ref,
        paymentStatus: 'pending'
    });
    return {
        order,
        paymentLink: paymentResponse.data.link
    }
};

const confirmOrder = async (transactionId) => {
    const verification = await verifyPayment(transactionId);

    if(verification.status !== "success") throw new Error("Payment verification failed");

    // Here you would typically verify the payment status with the payment gateway
    // For simplicity, we'll assume the payment is successful if we reach this point

    const tx_ref = verification.data.tx_ref;
    const amountPaid = verification.data.amount;
    const paymentStatus = verification.data.status;

    // find order using paymentRef(tx_ref)

    const order = await Order.findOne({paymentRef: tx_ref});
    if(!order) throw new Error("Order not found");

    if(paymentStatus === "successful"){
        order.status = "completed";
        order.totalAmount = amountPaid;
        await order.save();

        // get all cart items and delete them
        const cartItems = await Cart.find({userId: order.userId});
        
        // loop through each item to reduce the instock quantity of each product
        for(const item of cartItems){
            await Product.findByIdAndUpdate(
                item.productId,
                {$inc: {inStock: -item.quantity}},
                {new: true}
            );
        }
        // delete the cart after order success
        await Cart.deleteMany({userId: order.userId});

    }else{
        order.status = "Failed";
        await order.save();
    }
    return order;
};


module.exports = {
    placeOrder, confirmOrder
};