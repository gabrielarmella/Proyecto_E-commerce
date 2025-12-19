import { Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminEditProductPage from "./pages/AdminEditProductPage.jsx";
import AdminCreateProductPage from "./pages/AdminCreateProductPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import SetPasswordPage from "./pages/SetPasswordPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

import { useAuth } from "./context/AuthContext.jsx";
import { useCart } from "./context/CartContext.jsx";

function App() {
  const { user, loading, logout } = useAuth();
  const { itemCount } = useCart();

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  if (loading) {
    return (
      <p className="px-4 py-8 text-center text-slate-600">
        Cargando sesión...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">
              E-commerce
            </span>
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline text-slate-600">
                  Hola, <span className="font-semibold">{user.name}</span>
                </span>

                <Link
                  to="/cart"
                  className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Carrito
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {itemCount}
                  </span>
                </Link>

                <Link
                  to="/orders"
                  className="hidden sm:inline text-slate-700 hover:text-indigo-600"
                >
                  Mis órdenes
                </Link>
                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin/products"
                    className="hidden sm:inline text-slate-700 hover:text-indigo-600"
                  >
                    Admin
                  </Link>
                  )}

                <button
                  onClick={logout}
                  className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Registro
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage/></PrivateRoute>} />
          <Route path="/orders" element={<GuestRoute><OrdersPage/></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><LoginPage/></GuestRoute>} />
          <Route path="/register" element={<PrivateRoute><RegisterPage/></PrivateRoute>} />
          <Route path="/set-password" element={<PrivateRoute><SetPasswordPage/></PrivateRoute>} />
          {/* Google OAuth */}
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          {/* Admin*/}
          <Route path="/admin/products" element={
            <AdminRoute> 
              <AdminProductsPage /> 
            </AdminRoute>} 
          />
          <Route path="/admin/products/new" element={
            <AdminRoute>
              <AdminCreateProductPage />
            </AdminRoute>}
          />
          <Route path="/admin/products/:id/edit" element={
          <AdminRoute>
            <AdminEditProductPage />
          </AdminRoute>} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
