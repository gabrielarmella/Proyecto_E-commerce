import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client, { API_BASE_URL } from "../api/client.api.js";
import { useCart } from "../context/CartContext.jsx";

const resolveImageUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/uploads")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  return value;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try{
        const { data } = await client.get(`/api/products/${id}`);
        setProduct(data?.data || null);
      }catch (err) {
        setProduct(null);
        setError(err?.response?.data?.message || "No se pudo cargar el producto.");
      }finally{
        setLoading(false);
      }
    };
    load();
  }, [id]);

   useEffect(() => {
    if (!product) return;
    const rawImages = Array.isArray(product.images) && product.images.length
      ? product.images
      : product.image
      ? [product.image]
      : product.Image
      ? [product.Image]
      : [];
    setSelectedImage(resolveImageUrl(rawImages[0] || ""));
  }, [product]);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="form-error">{error}</div>
  if (!product) return <div>Producto no encontrado.</div>;

  const rawImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : product.image
    ? [product.image]
    : product.Image
    ? [product.Image]
    : [];
  const imageUrls = rawImages.map(resolveImageUrl).filter(Boolean);
  const fallbackImage = "https://via.placeholder.com/800x600.png?text=Producto";
  const mainImage = selectedImage || imageUrls[0] || fallbackImage;

  return (
    <div className="bg-white border rounded p-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-[72px_1fr]">
          <div className="flex md:flex-col gap-2 overflow-auto">
            {imageUrls.length ? (
              imageUrls.map((url, index) => (
                <button
                  key={`${product._id}-thumb-${index}`}
                  type="button"
                  className={`h-16 w-16 rounded border bg-white p-1 ${
                    url === mainImage ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover rounded"
                  />
                </button>
              ))
            ) : (
              <div className="h-16 w-16 rounded border border-gray-200 bg-gray-50" />
            )}
          </div>

          <div className="w-full h-96 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Nuevo</p>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-600 mt-1">${product.price}</p>
          </div>

          <p className="text-sm text-gray-600">{product.description}</p>

          <div className="bg-gray-50 border rounded p-4 space-y-3">
            <div className="text-sm text-gray-600">
              Stock: <span className="font-semibold text-gray-800">{product.stock ?? 0}</span>
            </div>
             <button className="btn-primary w-full" onClick={async() => {await addItem(product._id, 1, product); navigate("/cart")}}>
              Comprar ahora
            </button>
            <button className="btn-primary w-full" onClick={() => addItem(product._id, 1, product)}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}