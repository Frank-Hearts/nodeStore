const Product = require('../models/product.model');
const cloudinary = require('../config/cloudinary.config');

const createProduct = async ({name, description, price, category, inStock, image}) => {
    try {
        const uploadResult = await cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'products' },
            async (error, result) => {
                if (error) {
                    throw new Error('Image upload failed');
                }
    
                const newProduct = new Product({
                    name, description, price, category, inStock, image: result.secure_url
                });
              await newProduct.save();
            }
    
        );
        uploadResult.end(image);
        return;

    }catch (error) {
        throw new Error('Product creation failed' + error.message);
    }    
}

const getAllProducts = async () => {
    try {
        return await Product.find().sort({createdAt: -1});
    } catch (error) {
        throw new Error('Failed to fetch products' + error.message);
    }
};

const getProductById = async (productId) => {
    try {
        return await Product.findById(productId);
    } catch (error) {
        throw new Error('Failed to fetch product' + error.message);
    }
};

const deleteProductById = async (productId) => {
    try{
        return await Product.findByIdAndDelete(productId);
    }catch(error){
        throw new Error('Failed to delete product' + error.message);
    }
};

const updateProduct = async(productId, updateData) => {
    try{
        return Product.findByIdAndUpdate(productId, updateData, {
            new: true,
            runValidators: true
        });

    }catch(error){
        throw new Error("Update failed", error.Error);
    }
};

const searchProducts = async (name, category) => {
    try {
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex search
        }
        if (category) {
            query.category = category;
        }
        return Product.find(query).sort({ createdAt: -1 });
    } catch (error) {
        throw new Error('Search failed' + error.message);
    }
};

module.exports = {createProduct, getAllProducts, getProductById, deleteProductById, updateProduct, searchProducts};