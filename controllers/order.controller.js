const orderService = require('../services/order.service');

const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await orderService.placeOrder(userId);
        res.status(201).json({
            sucess: true,
            message: 'Order placed successfully', 
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false, 
            message: error.message || "something went terribly wrong" 
        });
    }
};

const confirmOrder = async (req, res) => {
    try {
        const {transaction_id} = req.query;
        if(!transaction_id) throw new Error("Transaction ID is required");
        // res.status(200).json({
        //     message: "The transaction id is" + transaction_id
        // });

        const order = await orderService.confirmOrder(transaction_id);

        res.status(200).json({
            success: true,
            message: `Order ${order.status === "completed" ? "Confirmed": "Failed"}`,
            data: order
        });

        if(order.status === "completed"){
            return res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`);
        }else{
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?orderId=${order._id}`);
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "something went wrong"
        });
    }
};


module.exports = {
    placeOrder, confirmOrder
};