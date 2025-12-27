import React, { useEffect, useRef, useState } from "react";
import client, { extractErrorMessage } from "../api/client.api.js";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  stock: "",
  category: "",
  brand: "",
  tags: "",
  active: true,
  isFeatured: false,
  images: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await client.get("/api/products/admin/all");
        setProducts(data?.data?.products || []);
      } catch (err) {
        setError(extractErrorMessage(err, "No se pudieron cargar los productos."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      price: product.price ?? "",
      description: product.description || "",
      stock: product.stock ?? "",
      category: product.category || "",
      brand: product.brand || "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      active: product.active ?? true,
      isFeatured: product.isFeatured ?? false,
      images: Array.isArray(product.images) ? product.images : [],
    });
    setImageFiles([]);
    setError("");
    setSuccess("");
  };

  const handleChange = (field) => (event) => {
    const { type, checked, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilesChange = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setImageFiles(nextFiles);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    if (event.dataTransfer?.items?.length) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = 0;
    setIsDragActive(false);

    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    if (!droppedFiles.length) return;
    const imageOnly = droppedFiles.filter((file) => file.type?.startsWith("image/"));
    setImageFiles(imageOnly.length ? imageOnly : droppedFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let nextImages = form.images || [];

      if (imageFiles.length) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        const { data } = await client.post("/api/upload/products", formData);
        const uploadedImages = data?.images || [];
        const urls = uploadedImages
          .map((image) => image?.url || (image?.fileName ? `/uploads/products/${image.fileName}` : ""))
          .filter(Boolean);

        if (!urls.length) {
          throw new Error("No se pudo registrar ninguna imagen.");
        }
        nextImages = urls;
      }

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description,
        stock: Number(form.stock || 0),
        category: form.category,
        brand: form.brand,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        active: Boolean(form.active),
        isFeatured: Boolean(form.isFeatured),
        images: nextImages,
      };

      const { data: updated } = await client.put(`/api/products/${editingId}`, payload);
      const updatedProduct = updated?.data;

      if (updatedProduct?._id) {
        setProducts((prev) =>
          prev.map((item) => (item._id === updatedProduct._id ? updatedProduct : item))
        );
        setForm((prev) => ({
          ...prev,
          images: Array.isArray(updatedProduct.images) ? updatedProduct.images : nextImages,
        }));
      }

      setImageFiles([]);
      setSuccess("Producto actualizado correctamente.");
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo actualizar el producto."));
    } finally {
      setSaving(false);
    }
  };

  const selectedProduct = products.find((product) => product._id === editingId);

  return (
    <div className="bg-white border rounded p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin productos</h1>
      {error && <div className="form-error">{error}</div>}
      {success && (
        <div className="text-green-700 bg-green-100 border border-green-200 rounded p-2 text-sm">
          {success}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-700">Listado</h2>
          {loading ? (
            <div>Cargando productos...</div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="border rounded px-3 py-2 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">${product.price}</div>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => handleSelectProduct(product)}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">Editar producto</h2>
          {!selectedProduct ? (
            <div className="text-sm text-gray-500">Selecciona un producto para editar.</div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Nombre</label>
                <input value={form.name} onChange={handleChange("name")} required />
              </div>
              <div className="form-grid-2">
                <div className="form-row">
                  <label>Precio</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange("price")}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange("stock")}
                  />
                </div>
              </div>
              <div className="form-row">
                <label>Descripcion</label>
                <textarea
                  className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>
              <div className="form-grid-2">
                <div className="form-row">
                  <label>Categoria</label>
                  <input value={form.category} onChange={handleChange("category")} />
                </div>
                <div className="form-row">
                  <label>Marca</label>
                  <input value={form.brand} onChange={handleChange("brand")} />
                </div>
              </div>
              <div className="form-row">
                <label>Tags (separados por coma)</label>
                <input value={form.tags} onChange={handleChange("tags")} />
              </div>
              <div className="form-row">
                <label>Imagenes (una o varias)</label>
                <div
                  className={`flex flex-col items-start gap-2 rounded-lg border-2 border-dashed px-4 py-4 transition ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    id="product-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="product-images"
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isDragActive
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    Elegir archivos
                  </label>
                  <span className="text-xs text-gray-500">
                    {isDragActive ? "Suelta las imagenes aqui." : "o arrastra y suelta aqui."}
                  </span>
                </div>
                {form.images?.length ? (
                  <div className="text-xs text-gray-500 mt-1">
                    {form.images.length} imagen(es) actuales.
                  </div>
                ) : null}
                {imageFiles.length ? (
                  <div className="text-xs text-gray-500 mt-1">
                    {imageFiles.length} nueva(s) imagen(es) seleccionada(s).
                  </div>
                ) : null}
                <div className="text-xs text-gray-400 mt-1">
                  Si subes nuevas imagenes, se reemplazaran las actuales.
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={handleChange("active")}
                  />
                  Activo
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={handleChange("isFeatured")}
                  />
                  Destacado
                </label>
              </div>
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Actualizando..." : "Actualizar producto"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
