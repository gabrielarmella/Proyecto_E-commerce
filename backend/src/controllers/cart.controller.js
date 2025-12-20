import cartService from '../services/cart.service.js';

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.json({ success: true, data:cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener el carrito" });
    }
};

const addItem = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const cart = await cartService.addItem({
            userId: req.user.id,
            productId,
            quantity
        });
        res.json({ success: true, data: cart });
    } catch (error) {
        if (error.message === 404) {
            return res .status(404).json({ success: false, message: "Producto no encontrado" });
        }
        res.status(500).json({ success: false, message: "Error al agregar el producto al carrito", });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const {quantity} = req.body;
        const {productId} = req.params;
        const cart = await cartService.updateItemQuantity({
            userId: req.user.id,
            productId,
            quantity
        });
        res.json({ success: true, data: cart });
    } catch (error) {
        if (error.message === 404) {
            return res.status(404).json({ success: false, message: "Producto no encontrado en el carrito" });
        }
        res.status(500).json({ success: false, message: "Error al actualizar la cantidad del producto en el carrito", });
    }
};

const removeItem = async (req, res) => {
    try {
        const {productId} = req.params;
        const cart = await cartService.removeItem({
            userId: req.user.id,
            productId,
        });
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar el producto del carrito", });
    }
};

const clearCart = async (req, res) => {
    try {
        await cartService.clearCart(req.user.id);
        res.json({ success: true, message: "Carrito vaciado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al vaciar el carrito" });
    }
};

export default {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
};