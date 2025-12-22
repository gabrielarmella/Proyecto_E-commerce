import orderService from "../services/order.service.js";

const checkout = async (req, res) => {
    const order = await orderService.checkoutFromCart({
        userId: req.user.id,
        mediosPago: req.body.mediosPago,
        direccionEnvio: req.body.direccionEnvio,
    });
    return res.status(201).json({ success: true, data: order });
};

const getMyOrders = async (req, res) => {
    const orders = await orderService.getMyOrders(req.user.id);
    return res.json({ success: true, data: orders });
};

const getAllOrders = async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await orderService.getAllOrders({ page, limit, status});
    return res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
    });
};

export default {
    checkout,
    getMyOrders,
    getAllOrders,
};