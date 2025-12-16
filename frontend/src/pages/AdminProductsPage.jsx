import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../api/adminProducts.js";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try{
            const res = await getAdminProducts({ search, page: 1, limit: 50 });
            setProducts(res.data || []);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        load();
    }
     return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin · Productos</h1>
            <p className="text-slate-600 mt-1">Editá, activá/desactivá y administrá tu catálogo.</p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Nuevo producto
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre/categoría/marca..."
            className="w-full md:w-96 rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="rounded-md border border-slate-300 px-4 py-2 text-sm bg-white hover:bg-slate-50">
            Buscar
          </button>
        </form>

        {loading ? (
          <p className="mt-6 text-slate-600">Cargando...</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="text-left">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Activo</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100">
                    <td className="p-3 font-medium text-slate-900">{p.name}</td>
                    <td className="p-3 text-slate-600">{p.category}</td>
                    <td className="p-3">${Number(p.price).toFixed(2)}</td>
                    <td className="p-3">{p.stock ?? 0}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.active ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="inline-flex items-center justify-center rounded-md border border-indigo-600 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="p-6 text-slate-600" colSpan={6}>
                      No hay productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

