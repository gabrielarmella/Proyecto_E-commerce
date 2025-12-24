import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client.api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await client.get(`/api/products/${id}`);
      setProduct(data?.data || null);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div>Cargando productos...</div>;
  if (!product) return <div>Producto no encontrado.</div>;

  return (
    <div className="bg-white border rounded p-6">
      <h1 className="text-xl font-semibold">{product.name}</h1>
      <p className="text-gray-600">${product.price}</p>
      <p className="mt-2">{product.description}</p>
      <button className="btn-primary mt-4" onClick={() => addItem(product._id, 1, product)}>
        Añadir al carrito
      </button>
    </div>
  );
}
