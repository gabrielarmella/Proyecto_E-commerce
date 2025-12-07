import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

//Obtener o crear el carrito del usuario
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

// GET /api/cart - Obtener el carrito del usuario 
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user.id);
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener el carrito" });
    }
});

// POST /api/cart/items - Agregar un producto al carrito
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.active) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        let cart = await getOrCreateCart(req.user.id);

        const existingItem = cart.items.find((item) =>
        item.product._id.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: product._id, quantity });
        }

        await cart.save();

        cart = await cart.populate("items.product");
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al agregar el producto al carrito" });
    }
});

// PUT /api/cart/item - Actualizar la cantidad de un producto en el carrito

router.put("/item/:productId", authMiddleware, async (req, res) => {
    try {
        const {quantity} = req.body;
        const {productId} = req.params;

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: "Cantidad inválida" });
        }

        let cart = await getOrCreateCart(req.user.id);

        const item = cart.items.find(
            (it) => it.product._id.toString() === productId
        );

        if (!item) {
            return res
                .status(404)
                .json({ success: false, message: "Producto no encontrado en el carrito" });
        }

        item.quantity = quantity;
        await cart.save();

        cart = await cart.populate("items.product");
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar el producto en el carrito" });
    }
});

// DELETE /api/cart/item/:productId - Eliminar un producto del carrito

router.delete("/item/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await getOrCreateCart(req.user.id);

        cart.items = cart.items.filter(
            (it) => it.product._id.toString() !== productId
        );

        await cart.save();
        cart = await cart.populate("items.product");

        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar el producto del carrito" });
    }
});

// POST /api/cart/clear - Vaciar el carrito
router.post("/clear", authMiddleware, async (req, res) => {
    try {
        let cart = await getOrCreateCart(req.user.id);
        cart.items = [];
        await cart.save();
        res.json({ success: true, message: "Carrito vaciado correctamente"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al vaciar el carrito" });
    }
});

export default router;
