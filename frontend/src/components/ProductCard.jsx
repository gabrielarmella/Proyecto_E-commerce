import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold text-indigo-600">${product.price}</span>
        <div className="flex gap-2">
          <Link className="text-sm text-blue-600" to={`/products/${product._id}`}>
            Ver
          </Link>
          <button
            onClick={() => onAdd(product)}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}