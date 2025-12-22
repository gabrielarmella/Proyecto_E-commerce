import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import orderRepository from "../repositories/order.repository.js";
import { orderToDTO } from "../dto/order.dto.js";


const checkoutFromCart = async ({ userId, mediosPago, direccionEnvio }) => {
    const session = await mongoose.startSession();
    let orderDoc;

    try{
        await session.withTransaction(async () => {
            let cart = await cartRepository.findByUser(userId, {session});
            if (!cart || cart.items.length === 0){
                throw new AppError("El carrito esta vacio", 400, "CART_EMPTY");
            }

            await cartRepository.populateCart(
                cart,
                "name price stock active",
                session
            );
            const items = [];
            let total = 0;

            for (const cartItem of cart.items){
                const product = cartItem.product;
                if(!product || product.active === false){
                    throw new AppError(
                        "Producto no disponible",
                        400,
                        "PRODUCT_INACTIVE",
                        { productId: product?._id }
                    );
                }
                if (product.stock < cartItem.quantity){
                    throw new AppError(
                        `Stock insuficiente para ${product.name}`,
                        409, 
                        "INSUFFICIENT_STOCK",
                        { productId: product._id, available: product.stock }
                    );
                }
                const updated = await productRepository.decremenStock(
                    product._id,
                    cartItem.quantity,
                    session
                );
                if (!updated){
                    throw new AppError(
                        `Stock insuficiente para ${product.name}`,
                        409,
                        "INSUFFICIENT_STOCK",
                        { product: product._id }
                    );
                }
                const price = Number(product.price);
                total += price * cartItem.quantity;

                items.push({
                    product: product._id,
                    quantity: cartItem.quantity,
                    price,
                });
            }
            orderDoc = await orderRepository.create(
                {
                    user: userId,
                    items,
                    total,
                    status: "pendiente",
                    mediosPago: mediosPago || "mercadoPago",
                    estatusPago: "pendiente",
                    direccionEnvio: direccionEnvio || null,
                },
                { session }
            );
            cart.items = [];
            await cartRepository.saveCart(cart, { session });
        });
    }finally {
        await session.endSession();
    }

    if(!orderDoc){
        throw new AppError("No se pudo crear la orden", 500, "ORDER_NOT_CREATED");
    }

    const order = await orderRepository
        .findById(orderDoc._id)
        .populate("Items.product", "name price images")
        .populate("user", "name mail")
        .lean();
    return orderToDTO(order); 
};

const getMyOrders = async (userId) => {
    const orders = await orderRepository
        .find({ user: userId }, null, { sort: {createdAt: -1 } })
        .populate("items.product", "name price images")
        .lean();
    return orders.map(orderToDTO);
};

const getAllOrders = async ({ page = 1, limit = 20, status }) => {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;
    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
        orderRepository
            .find(filter, null, { sort: { createdAt: -1 }, skip, limit: limitNumber })
            .populate("user", "name email")
            .populate("items.product", "name price")
            .lean(),
        orderRepository.countDocuments(filter),
    ]);
    return{
        orders: orders.map(orderToDTO),
        pagination: {
            total, 
            page: pageNumber,
            limit: limitNumber,
            pages: Math.ceil(total / limitNumber),
        },
    };
};

export default {
    checkoutFromCart,
    getMyOrders,
    getAllOrders,
};