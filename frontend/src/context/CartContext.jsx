import { createContext, useContext, useEffect, useState } from "react";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../api/cart.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      setError("No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) return { success: false, needsAuth: true };

    try {
      setLoading(true);
      setError(null);
      const res = await addToCart(productId, quantity);
      setCart(res.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "No se pudo agregar al carrito.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    if (!user) return { success: false, needsAuth: true };
    try {
      setLoading(true);
      setError(null);
      const res = await updateCartItem(productId, quantity);
      setCart(res.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "No se pudo actualizar el carrito.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    if (!user) return { success: false, needsAuth: true };
    try {
      setLoading(true);
      setError(null);
      const res = await removeCartItem(productId);
      setCart(res.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "No se pudo eliminar el producto.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearCartItems = async () => {
    if (!user) return { success: false, needsAuth: true };
    try {
      setLoading(true);
      setError(null);
      await clearCartApi();
      setCart({ ...cart, items: [] });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "No se pudo vaciar el carrito.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        loading,
        error,
        fetchCart,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart: clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
