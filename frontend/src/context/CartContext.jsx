import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as cartApi from "../api/cart.api.js";
import { extractErrorMessage } from "../api/client.api.js";

const CartContext = createContext(null);
const LOCAL_CART_KEY = "cart";

const readLocalCart = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const writeLocalCart = (cart) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
};

const clearLocalCart = () => {
  localStorage.removeItem(LOCAL_CART_KEY);
};

const computeTotals = (items = []) => {
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  return { itemCount, total };
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setCartFromBackend = (cartData) => {
    const data = cartData?.data ?? cartData;
    const backendItems = data?.items || [];
    const totals = data?.totals || { items: 0, amount: 0 };
    setItems(backendItems);
    setItemCount(totals.items || 0);
    setTotal(totals.amount || 0);
  };

  const setCartFromLocal = (cart) => {
    const localItems = cart.items || [];
    const totals = computeTotals(localItems);
    setItems(localItems);
    setItemCount(totals.itemCount);
    setTotal(totals.total);
  };

  const syncCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      let res = await cartApi.getCart();
      if (!res?.success) throw new Error(res?.error?.message || "Failed to load cart");
      const localCart = readLocalCart();

      if (localCart.items.length > 0) {
        // Merge local cart into backend once after login.
        for (const item of localCart.items) {
          await cartApi.addItem(item.productId, item.quantity);
        }
        res = await cartApi.getCart();
        if (!res?.success) throw new Error(res?.error?.message || "Failed to sync cart");
        clearLocalCart();
      }

      setCartFromBackend(res.data);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load cart"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    } else {
      setCartFromLocal(readLocalCart());
    }
  }, [isAuthenticated, user?.id]);

  const addItem = async (productId, quantity = 1, productMeta = null) => {
    setError(null);
    if (isAuthenticated) {
      const res = await cartApi.addItem(productId, quantity);
      if (!res?.success) throw new Error(res?.error?.message || "Failed to add item");
      setCartFromBackend(res.data);
      return;
    }

    const cart = readLocalCart();
    const existing = cart.items.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: productMeta?.name || "Item",
        price: Number(productMeta?.price || 0),
        quantity,
        image: productMeta?.images?.[0] || productMeta?.image || "",
      });
    }
    writeLocalCart(cart);
    setCartFromLocal(cart);
  };

  const updateQty = async (productId, quantity) => {
    setError(null);
    if (isAuthenticated) {
      const res = await cartApi.updateItem(productId, quantity);
      if (!res?.success) throw new Error(res?.error?.message || "Failed to update item");
      setCartFromBackend(res.data);
      return;
    }

    const cart = readLocalCart();
    const item = cart.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    writeLocalCart(cart);
    setCartFromLocal(cart);
  };

  const removeItem = async (productId) => {
    setError(null);
    if (isAuthenticated) {
      const res = await cartApi.removeItem(productId);
      if (!res?.success) throw new Error(res?.error?.message || "Failed to remove item");
      setCartFromBackend(res.data);
      return;
    }

    const cart = readLocalCart();
    cart.items = cart.items.filter((i) => i.productId !== productId);
    writeLocalCart(cart);
    setCartFromLocal(cart);
  };

  const clearCart = async () => {
    setError(null);
    if (isAuthenticated) {
      const res = await cartApi.clearCart();
      if (!res?.success) throw new Error(res?.error?.message || "Failed to clear cart");
      setCartFromBackend(res.data);
      return;
    }

    clearLocalCart();
    setCartFromLocal({ items: [] });
  };

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      loading,
      error,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, itemCount, total, loading, error]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
