import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-indigo-600">
          E-Commerce
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-indigo-600">Productos</Link>
          <Link to="/orders" className="hover:text-indigo-600">Órdenes</Link>
          <Link to="/cart" className="hover:text-indigo-600">
            Carrito {itemCount > 0 && <span className="text-sm text-indigo-600">({itemCount})</span>}
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin/products" className="hover:text-indigo-600">Admin</Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">
              Logout ({user?.email})
            </button>
          ) : (
            <Link to="/login" className="hover:text-indigo-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}