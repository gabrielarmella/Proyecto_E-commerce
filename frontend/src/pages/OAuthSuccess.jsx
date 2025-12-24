import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function OAuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleOAuthToken } = useAuth();
  const [message, setMessage] = useState("Processing login...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("Missing token");
      navigate("/login", { replace: true });
      return;
    }

    const run = async () => {
      const ok = await handleOAuthToken(token);
      if (ok) {
        navigate("/products", { replace: true });
      } else {
        setMessage("Invalid token");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [location.search, handleOAuthToken, navigate]);

  return <div className="text-center">{message}</div>;
}
