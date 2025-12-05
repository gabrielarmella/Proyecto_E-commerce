import {Router} from 'express';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';
import {authMiddleware, adminOnly} from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/orders - Crear una nueva orden (usuario autenticado)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {items} = req.body; //[{product: productId, quantity: number}]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res 
            .status(400)
            .json({success: false, message: "La orden debe contener al menos un ítem"});
        }

        //Obtener detalles de productos y calcular total

        const detailedItems = [];
        let total = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.active) {
                return res
                .status(400)
                .json({success: false, message: `Producto no encontrado o inactivo: ${item.productId}`});
            }

            const quantity = item.quantity || 1;
            const itemTotal = product.price * quantity;
            total += itemTotal;

            detailedItems.push({
                product: product._id,
                quantity,
                price: product.price,
            });
        }

        const order = await Order.create({
            user: req.user.id,
            items: detailedItems,
            total,
        });

        res.status(201).json({success: true, data: order});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Error al crear la orden"});
    }
});

// GET /api/orders - Obtener todas las órdenes del usuario autenticado
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user.id})
        .populate("items.product", "name price")
        .sort({createdAt: -1});

        res.json({success: true, data: orders});
    } catch (error) {
        res.status(500).json({success: false, message: "Error al obtener las órdenes"});
    }
}); 

// GET /api/orders/all - Obtener todas las órdenes (solo admin)
router.get("/", authMiddleware, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name price")
        .sort({createdAt: -1});

        res.json({success: true, data: orders});
    } catch (error) {
        res.status(500).json({success: false, message: "Error al obtener las órdenes"});
    }
});

// POST /api/orders//checkout - crear orden desde el carrito (usuario autenticado)
router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const { medioPago, direccionEnvio } = req.body;
        // Aquí deberías obtener el carrito del usuario

        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito está vacío" });
        }
        
        let total = 0;
        const items = cart.items.map((item) => {
            const precio = item.product.price;
            total += precio * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: precio,
            };
        });

        const order = await Order.create({
            user: req.user.id,
            items,
            total,
            medioPago: medioPago || "mercadoPago",
            direccionEnvio: direccionEnvio || null,
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al procesar el checkout" });
    }
});

export default router;