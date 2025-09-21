import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { useScreenSize } from "../context/screenSizeContext";
import BaseLayout from "../layouts/base-layout.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config.js";
import * as jose from "jose";
import Home from "../containers/Home";
import Login from "../containers/Login";
import Register from "../containers/Register";
import TreePage from "../containers/tree/TreePage.js";
import { Navigate } from "react-router";
import Navbar from "../components/Navbar.js";

const Router = () => {
  const isSmallScreen = useScreenSize();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? JSON.parse(storedToken) : null;
  });

  useEffect(() => {
    const verify_token = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
        } else {
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.post(`${URL}/verify_token`);
          return response.data.ok ? login(token) : logout();
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  }, [token]);

  const login = (token: string): void => {
    const decodedToken = jose.decodeJwt(token);
    // composing a user object based on what data we included in our token (login controller - jwt.sign() first argument)
    const user = {
      email: decodedToken.userEmail,
      familyId: decodedToken.familyId,
    };
    setToken(token);
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <BaseLayout>
          <Navbar isLoggedIn={isLoggedIn} />
          <Outlet />
        </BaseLayout>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: isLoggedIn ? (
            <Navigate to="/tree-page" />
          ) : (
            <Login login={login} />
          ),
        },
        {
          path: "register",
          element: isLoggedIn ? <Navigate to="/tree-page" /> : <Register />,
        },
        {
          path: "/tree-page",
          element: isLoggedIn ? (
            <TreePage logout={logout} user={user} />
          ) : (
            <Navigate to="/" />
          ),
          // loader: treeLoader,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
