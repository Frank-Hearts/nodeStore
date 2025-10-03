const productService = require('../services/product.service');
// const productController = require('../controllers/product.controller');

const createProduct = async (req, res) => {
    try {
        const{name, description, price, category, inStock} = req.body;
        if(!name || !price || !category || !inStock || !description || !req.file) {
            return res.status(400).json({message: "All fields are required"});
        }

        const image = req.file.buffer;
        await productService.createProduct({name, description, price, category, inStock, image});
        res.status(201).json({message: "Product created successfully"});
    }catch(error){
        res.status(400).json({message: error.message});
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({message: "Products fetched successfully", products});
    }catch (error) {
        res.status(500).json({message: "Failed to fetch products"});
    }
};

const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.getProductById(productId);
        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product fetched successfully", product});
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.deleteProductById(productId);
        if(!product) {
            return res.status(400).json({message: "Product not found"});
        }
        res.status(200).json({message: "Products deleted successfully"});
    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

const updateProduct = async (req, res) => {
    try{
        const productId = req.params.id;
        const updateData = req.body;

        const updatedProduct = await productService.updateProduct(productId, updateData);

        if(!updatedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product updated successfully", product:updatedProduct});
    }catch(error){
        res.status(400).json({message: error.message});
    }
};

const searchProducts = async (req, res) => {
    try {
        const {name, category} = req.query;

        const products = await productService.searchProducts(name, category);
        res.status(200).json({ message: "Search completed successfully", products });
    } catch (error) {
        res.status(400).json({ message: "Product not found"});
    }
};

module.exports = {createProduct, getAllProducts, getProductById, deleteProductById, updateProduct, searchProducts};