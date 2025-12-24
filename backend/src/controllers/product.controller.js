import AppError from "../utils/appError.js";
import productService from "../services/product.service.js";

const getAdminProducts = async (req, res) => {
  const { products, pagination } = await productService.getAdminProducts(req.query);
  return res.json({ success: true, data: { products, pagination } });
};

const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product || !product.active) {
    throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
  }
  return res.json({ success: true, data: product });
};

const getPublicProducts = async (req, res) => {
  const { products, pagination } = await productService.getPublicProducts(req.query);
  return res.json({ success: true, data: { products, pagination } });
};

const updateProduct = async (req, res) => {
  const updatedProduct = await productService.updateProduct(req.params.id, req.body);
  if (!updatedProduct) {
    throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
  }
  return res.json({ success: true, data: updatedProduct });
};

const createProduct = async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  return res.status(201).json({ success: true, data: newProduct });
};

const deleteProduct = async (req, res) => {
  const deletedProduct = await productService.deleteProduct(req.params.id);
  if (!deletedProduct) {
    throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
  }
  return res.json({
    success: true,
    data: {
      message: "Producto eliminado correctamente",
      product: deletedProduct,
    },
  });
};

export default {
  getAdminProducts,
  getProductById,
  getPublicProducts,
  updateProduct,
  createProduct,
  deleteProduct,
};
