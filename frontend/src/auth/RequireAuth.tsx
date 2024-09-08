import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../utils/helpers";
import { regenerateAccessToken } from "../api/user";

const RequireAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = getCookie("access_token");
        if (!accessToken) {
          const newToken = await regenerateAccessToken();
          setIsAuthenticated(!!newToken);
        } else {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default RequireAuth;
