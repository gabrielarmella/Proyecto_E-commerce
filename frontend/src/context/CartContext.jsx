import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../api/cart.api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const add  = async (payload) => {
    const data = await addToCart(payload);
    setCart(data);
  };

  const update = async ({ productId, quantity }) => {
    const data = await updateCartItem({ productId, quantity });
    setCart(data);
  };

  const remove = async (productId) => {
    const data = await removeCartItem(productId);
    setCart(data);
  };

  const clear = async () => {
    const data = await clearCartApi();
    setCart(data);
  };
  const items = cart?.items || [];
  const itemCount = items.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const subtotal =
    cart?.totals?.amount ??
    items.reduce((acc, it) => acc + (it.price || it.product?.price || 0) * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        subtotal,
        loading,
        error,
        syncCart,
        addToCart: add,
        updateQty: update,
        removeItem: remove,
        clearCart: clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
