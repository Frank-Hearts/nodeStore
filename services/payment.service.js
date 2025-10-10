const axios = require('axios');
require('dotenv').config();

const{ FLUTTERWAVE_BASE_URL,FLUTTERWAVE_TEST_KEY} = process.env;

const initializePayment = async (paymentData) => {
    try {
        const response = await axios.post(`${FLUTTERWAVE_BASE_URL}/payments`, 
            paymentData, 
            {
                headers: {
                    Authorization: `Bearer ${FLUTTERWAVE_TEST_KEY}`,
                    'Content-Type': "application/json"
                }
            }
        );
        if (response.data.status !== 'success') {
            console.log("error occurred", error.response?.data || error);
            throw new Error(response.data.message || "Payment initialization failed");
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.message || error.message?.data?.error || error.message);
    }
};

const verifyPayment = async (transactionId) => {
    try {
        const response = await axios.get(
            `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
            {
                headers: {
                    Authorization: `Bearer ${FLUTTERWAVE_TEST_KEY}`
                }
            }
        );
       return response.data;
    } catch (error) {
        throw new Error(error.response? error.response.data.message : error.message);
    }

};

module.exports = {
    initializePayment, verifyPayment
};