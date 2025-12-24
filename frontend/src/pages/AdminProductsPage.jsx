import React, { useEffect, useState } from "react";
import client from "../api/client.api.js";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await client.get("/api/products/admin/all");
      setProducts(data?.data?.products || []);
    };
    load();
  }, []);

  return (
    <div className="bg-white border rounded p-6">
      <h1 className="text-xl font-semibold mb-4">Admin productos</h1>
      {products.map((product) => (
        <div key={product._id} className="border-b py-2">
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
}
