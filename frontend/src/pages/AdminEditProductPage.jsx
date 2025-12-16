import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "../api/client.js";
import { uploadProductImage } from "../api/admin.js";
import { updateProduct } from "../api/adminProducts.js";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:3000",
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "general",
    brand: "",
    tags: "",
    isFeatured: false,
    active: true,
  });

  const [images, setImages] = useState([]);

  // cargar producto
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get(`/api/products/${id}`);
        const p = res.data?.data ?? res.data;

        setForm({
          name: p.name ?? "",
          price: p.price ?? "",
          description: p.description ?? "",
          stock: p.stock ?? 0,
          category: p.category ?? "general",
          brand: p.brand ?? "",
          tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
          isFeatured: Boolean(p.isFeatured),
          active: p.active !== undefined ? Boolean(p.active) : true,
        });

        setImages(Array.isArray(p.images) ? p.images : []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const removeImage = (url) => setImages((prev) => prev.filter((u) => u !== url));

  const handleUpload = async (file) => {
    setError("");
    setMsg("");

    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Solo imágenes");
    if (file.size > 5 * 1024 * 1024) return setError("Máx 5MB");

    try {
      setUploading(true);
      const res = await uploadProductImage(file); // { success, url }
      if (!res?.url) return setError("La API no devolvió url");
      setImages((prev) => [...prev, res.url]);
      setMsg("✅ Imagen subida");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description?.trim() || "",
      stock: Number(form.stock || 0),
      category: form.category?.trim() || "general",
      brand: form.brand?.trim() || "",
      images,
      isFeatured: Boolean(form.isFeatured),
      active: Boolean(form.active),
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    if (!payload.name) return setError("Nombre obligatorio");
    if (!Number.isFinite(payload.price) || payload.price < 0) return setError("Precio inválido");

    try {
      setSaving(true);
      await updateProduct(id, payload);
      setMsg("✅ Producto actualizado");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4 text-slate-600">Cargando producto...</p>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Editar producto</h1>
            <p className="text-slate-600 mt-1">ID: {id}</p>
          </div>
          <Link
            to="/admin/products"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            Volver
          </Link>
        </div>

        {(error || msg) && (
          <div className="mt-4 space-y-2">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {msg && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {msg}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (coma)</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                  Destacado
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  Activo
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </section>

          {/* IMAGES */}
          <aside className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Imágenes</h2>

            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files?.[0])}
              className="block w-full text-sm text-slate-600
                file:mr-3 file:rounded-md file:border-0 file:bg-slate-100
                file:px-3 file:py-2 file:text-sm file:font-medium
                file:text-slate-700 hover:file:bg-slate-200"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              {images.map((url) => (
                <div key={url} className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <img src={`${API_URL}${url}`} alt="img" className="w-full h-24 object-contain" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 h-7 w-7 rounded-md bg-white/90 border border-slate-200 text-slate-700 hover:bg-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {uploading && <p className="mt-3 text-sm text-slate-600">Subiendo...</p>}
            {images.length === 0 && !uploading && (
              <p className="mt-3 text-sm text-slate-500">Sin imágenes</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
