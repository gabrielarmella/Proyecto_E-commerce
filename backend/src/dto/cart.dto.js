import { calculateCartTotals } from "../utils/calculateCartTotal.js";

export const cartToDTO = (cart) => {
    if (!cart) return null;

    const items = (cart.items || []).map((item) => {
        const product = item.product || {};
        const productId = product._id
            ? product._id.toString()
            : product.toString();
        
        return {
            productId,
            name: product.name,
            price: Number(product.price ?? 0),
            stock: product.stock,
            quantity: item.quantity,
            Image: Array.isArray(product.images) ? product.images[0] : undefined,
        };
    });

    const totals = calculateCartTotals(cart.items || []);

    return {
        id: cart._id.toString(),
        user: cart.user?._id ? cart.user._id.toString() : cart.user?.toString?.(),
        items,
        totals: {
            items: totals.itemsCount,
            amount: totals.subtotal,
        },
        updateAt: cart.updateAt,
        createdAt: cart.createdAt,
    };
};