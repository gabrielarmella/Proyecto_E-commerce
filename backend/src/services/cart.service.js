import { get } from "node:http";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";

const getOrCreateCart = async (userId) => {
    let cart = await cartRepository.findByUser(userId);
    if (!cart) {
        cart = await cartRepository.createForUser(userId);
    }
    return cart;
};

const getCart = async (userId) => getOrCreateCart(userId);

const addItem = async ({ userId, productId, quantity = 1}) => {
    const product = await productRepository.findById(productId);
    if (!product || !product.active) {
        const error = new Error("Producto no encontrado");
        error.message = 404;
        throw error;
    }

    let cart = await getOrCreateCart(userId);
    const existingItem = cart.items.find((item) => item.product._id.toString() === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product: product._id, quantity });
    }
    await cartRepository.saveCart(cart);
    cart = await cartRepository.populateCart(cart);
    return cart;
};

const updateItemQuantity = async ({ userId, productId, quantity }) => {
    if (quantity <= 0){
        const error = new Error("Cantidad inválida");
        error.message = 400;
        throw error;
    }
    let cart = await getOrCreateCart(userId);
    const item = cart.items.find((item) => item.product._id.toString() === productId);
    if (!item) {
        const error = new Error("Producto no encontrado en el carrito");
        error.status = 404;
        throw error;
    }

    item.quantity = quantity;
    await cartRepository.saveCart(cart);
    cart = await cartRepository.populateCart(cart);

    return cart;
};

const removeItem = async ({ userId, productId }) => {
    let cart = await getOrCreateCart(userId);
    cart.items = cart.items.filter((item) => item.product._id.toString() !== productId);

    await cartRepository.saveCart(cart);
    cart = await cartRepository.populateCart(cart);
    return cart;
};

const clearCart = async (userId) => {
    const cart = await getOrCreateCart(userId);
    cart.items = [];
    await cartRepository.saveCart(cart);
    return cart;
};

export default {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
};