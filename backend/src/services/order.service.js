import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import orderRepository from "../repositories/order.repository.js";
import { orderToDTO } from "../dto/order.dto.js";


const checkoutFromCart = async ({ userId, mediosPago, direccionEnvio }) => {
  const session = await mongoose.startSession();

  try {
    const orderDTO = await session.withTransaction(async () => {
      const cart = await cartRepository.findByUser(userId, { session });
      if (!cart || cart.items.length === 0) {
        throw new AppError("El carrito esta vacio", 400, "CART_EMPTY");
      }

      await cartRepository.populateCart(cart, "name price stock active", session);

      const items = [];
      let total = 0;

      for (const cartItem of cart.items) {
        const qty = Number(cartItem.quantity);
        const product = cartItem.product;
        const productId = product?._id ?? cartItem.product;

        if (!Number.isInteger(qty) || qty <= 0) {
          throw new AppError("Cantidad invalida en el carrito", 400, "INVALID_QUANTITY", {
            productId,
          });
        }
        if (!product) {
          throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND", { productId });
        }
        if (product.active === false) {
          throw new AppError("Producto no disponible", 400, "PRODUCT_INACTIVE", { productId });
        }

        const updated = await productRepository.decrementStock(product._id, qty, session);
        if (!updated) {
          throw new AppError(`Stock insuficiente para ${product.name}`, 409, "INSUFFICIENT_STOCK", {
            productId: product._id,
          });
        }

        const price = Number(product.price);
        total += price * qty;
        items.push({ product: product._id, quantity: qty, price });
      }

      const cleared = await cartRepository.updateOne(
        { _id: cart._id, "items.0": { $exists: true } },
        { $set: { items: [] } },
        { session }
      );

      const modifiedCount = cleared?.modifiedCount ?? cleared?.nModified ?? 0;
      if (modifiedCount === 0) {
        throw new AppError("El carrito ya fue procesado", 409, "CART_ALREADY_PROCESSED");
      }

      const orderDoc = await orderRepository.create(
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

      const order = await orderRepository
        .findById(orderDoc._id, null, { session })
        .populate("items.product", "name price images")
        .populate("user", "name email")
        .lean();

      return orderToDTO(order);
    });

    return orderDTO;
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (userId) => {
  const orders = await orderRepository
    .find({ user: userId }, null, { sort: { createdAt: -1 } })
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

  return {
    orders: orders.map(orderToDTO),
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  };
};

export default { checkoutFromCart, getMyOrders, getAllOrders };
