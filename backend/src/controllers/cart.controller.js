import cartService from '../services/cart.service.js';

const getCart = async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    return res.json({ success: true, data: cart});
};

const addItem = async (req, res) => {
    const cart = await cartService.addItem({
        userId: req.user.id,
        productId: req.body.productId,
        quantity: req.body.quantity,
    });
    return res.status(201).json({ success: true, data: cart });
};

const updateItemQuantity = async (req, res) => {
    const cart = await cartService.updateItemQuantity({
        userId: req.user.id,
        productId: req.params.productId,
        quantity: req.body.quantity,
    });
    return res.json({ success: true, data: cart });
};

const removeItem = async (req, res) => {
    const cart = await cartService.removeItem({
        userId: req.user.id,
        productId: req.params.productId,
    });
    return res.json({ success: true, data: cart });
};

const clearCart = async (req, res) => {
    const cart = await cartService.clearCart(req.user.id);
    return res.json({ success: true, data: cart });
};

export default {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
};