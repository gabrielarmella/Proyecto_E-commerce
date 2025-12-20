import productService from '../services/product.service.js'; 

const getAdminProducts = async (req, res) => {
    try {
        const { products, pagination } = await productService.getAdminProducts(req.query);
        res.json({success:true, data: products, pagination});
    } catch (error) {
        res.status(500).json({success:false, message: "Error al obtener los productos (admin)"});
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product || !product.active) {
            return res.status(404).json({success:false, message: "Producto no encontrado"});
        }
        res.json({success:true, data: product});
    } catch (error) {
        res.status(404).json({success:false, message: "Id de producto inválido"});
    }
};

const getPublicProducts = async (req, res) => {
    try {
        const { products, pagination } = await productService.getPublicProducts(req.query);
        res.json({success:true, data: products, pagination});
    } catch (error) {
        console.log("Error en GET /api/products:", error);
        res.status(500).json({success:false, message: "Error al obtener los productos"});
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({success:false, message: "Producto no encontrado"});
        }
        res.json({success:true, data: updatedProduct});
    } catch (error) {
        console.error("Error en PUT /api/products/:id", error);
        res.status(400).json({success:false, message: "ID de producto inválido"});
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({success:true, data: newProduct});
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({success:false, message: error.message});
        }
        console.error("Error en POST /api/products", error);
        res.status(500).json({success:false, message: "Error al crear el producto"});
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({success:false, message: "Producto no encontrado"});
        }
        res.json({success:true, message:"Producto eliminado correctamente", data: deletedProduct});
    } catch (error) {
        console.error("Error en DELETE /api/products/:id", error);
        res.status(400).json({success:false, message: "ID de producto inválido"});
    }
};

export default {
    getAdminProducts,
    getProductById,
    getPublicProducts,
    updateProduct,
    createProduct,
    deleteProduct
};


               