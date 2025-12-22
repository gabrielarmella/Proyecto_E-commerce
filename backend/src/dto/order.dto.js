export const orderToDTO = (order) => {
    if (!order) return null;

    const items = (order.items || []).map((item) => {
        const product = item.product || {};
        const productId = product._id
            ? product._id.toString()
            : product.toString();

        return {
            productId,
            name: product.name,
            price: Number(item.price ?? product.price ?? 0),
            quantity: item.quantity,
        };
    });
    const userId = order.user?._id ? order.user._id.toString() : order.user?.toString?.();

    return {
        id: order._id?.toString?.() ?? order.id,
        user: userId,
        items,
        total: Number(order.total ?? 0),
        status: order.status,
        payment: {
            method: order.mediosPago,
            status: order.estatusPago,
        },
        shipping: order.direccionEnvio ?? null,
        ticket: order.ticket,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};