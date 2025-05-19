import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default ProtectedLayout;
