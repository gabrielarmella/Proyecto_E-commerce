import React, { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
  const clean = query.trim();
    if (!clean) return;
    navigate(`/products?search=${encodeURIComponent(clean)}`);
  };

  return (
    <nav className="w-full bg-white  border-b border-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-3 space-y-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Link to="/products" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="E-Commerce" className="h-9 w-auto" />
            <span className="font-semibold text-lg tracking-wide">E-Commerce</span>
          </Link>

          <form onSubmit={handleSearch} className="w-full md:flex-1">
            <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden">
              <input
                className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
                placeholder="Buscar productos, marcas y mas..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                autoComplete="off"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium border-l border-gray-200 text-gray-700"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 text-sm flex-wrap md:justify-end">
            {user && (
              <span className="text-xs text-gray-700">
                Hola, {user.name || user.email}
              </span>
            )}
            <Link to="/orders" className="font-medium">
              Mis compras
            </Link>
            <Link to="/cart" className="font-medium">
              Carrito
              <span className="ml-1 inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-xs rounded-full bg-white text-gray-800">
                {itemCount}
              </span>
            </Link>
            {isAdmin && (
              <Link to="/admin/products" className="font-medium">
                Admin
              </Link>
            )}
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Registrarse</Link>
              </>
            ) : (
              <button onClick={logout} className="text-red-600">
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
