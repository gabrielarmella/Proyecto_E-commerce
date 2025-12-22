import AppError from "../utils/appError.js";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import { cartToDTO } from "../dto/cart.dto.js"

const getOrCreateCart = async (userId) => {
    let cart = await cartRepository.findByUser(userId);
    if (!cart) {
        cart = await cartRepository.createForUser(userId);
    }
    await cartRepository.populateCart(cart);
    return cart;
};

const getCart = async (userId) => {
    const cart = getOrCreateCart(userId);
    return cartToDTO(cart);
};

const addItem = async ({ userId, productId, quantity = 1}) => {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0){
        throw new AppError("La cantidad debe ser mayor a 0", 400, "INVALID_QUANTITY");
    }

    const product = await productRepository.findById(
        productId,
        "name price stock active images",
        { lean: true}
    );
    if (!product || product.active === false){
        throw new AppError("Producto no encontrado o inactivo", 404, "PRODUCT_NOT_FOUND");
    }
    let cart = await getOrCreateCart(userId);
    const existingItem = cart.items.find(
        (item) => 
            (item.product?._id ?? item.product)?.toString() === productId
    );
    const desiredQty = (existingItem?.quantity || 0) + qty;
    if (product.stock < desiredQty){
        throw new AppError("Stock insuficiente", 409, "INSUFFICIENT_STOCK",{
            available: product.stock,
        });
    }
    if (existingItem){
        existingItem.quantity = desiredQty;
    } else{
        cart.items.push({ product: productId, quantity: qty});
    }
    await cartRepository.saveCart(cart);
    await cartRepository.populateCart(cart);
    return cartToDTO(cart);
};

const updateItemQuantity = async ({ userId, productId, quantity }) => {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0){
        throw new AppError("La cantida debe ser mayor a 0", 400, "INVALID_QUANTITY");
    }

    let cart = await getOrCreateCart(userId);
    const item = cart.items.find(
        (cartItem) => 
            (cartItem.product?._id ?? cartItem.product)?.toString() === productId
    );
    if (!item){
        throw new AppError("Producto no encontrado en el carrito", 404, "ITEM_NOT_FOUND");
    }
    const product = await productRepository.findById(
        productId,
        "name price stock active images",
        { lean: true }
    );
    if (!product || product.active === false){
        throw new AppError("Producto no encontrado o inactivo", 404, "PRODUCT_NOT_FOUND");
    }
    if (product.stock < qty){
        throw new AppError("Stock insuficiente", 409, "INSUFFICIENT_STOCK",{
            available: product.stock,
        });
    }
    item.quantity = qty;
    await cartRepository.saveCart(cart);
    await cartRepository.populateCart(cart);
    return cartToDTO(cart);
};

const removeItem = async ({ userId, productId }) => {
    const cart = await getOrCreateCart(userId);
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
        (item) => 
            (item.product?._id ?? item.product)?.toString() !== productId
    );

    if(cart.items.length === initialLength){
        throw new AppError("Producto no encontrado en el carrito", 404, "ITEM_NOT_FOUND");
    }

    await cartRepository.saveCart(cart);
    await cartRepository.populateCart(cart);
    return cartToDTO(cart);
};

const clearCart = async (userId) => {
    const cart = await getOrCreateCart(userId);
    cart.items = [];
    await cartRepository.saveCart(cart);
    await cartRepository.populateCart(cart);
    return cartToDTO(cart);
};

export default {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
};