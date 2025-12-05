import { Routes, Route, Link } from "react-router-dom";
import ProductsPage  from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App(){
  const { user, loading, logout } = useAuth();

  if (loading) return <p style={{ padding: "1rem"}}>Cargando sesión...</p>;

  return(
    <div>
      <header 
        style={{
          display:"flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid #ddd",
          marginBottom: "1rem",
        }}
        >
          <Link to="/" style={{ textDecoration: "none"}}>
            <h2>E-commerce</h2>
          </Link>
          <nav style={{ display: "flex", gap:"1rem", alignItems:"center"}}>
            {user ? (
              <>
                <span style={{ fontSize: "0.9rem"}}>
                  Hola, <strong>{user.name}</strong>
                </span>
                <button onClick={logout}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Registro</Link>
              </>
            )}
            </nav>        
          </header>
          <main>
            <Routes>
              <Route path="/" element={<ProductsPage/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
          </main>
        </div>
  );
}

export default App
