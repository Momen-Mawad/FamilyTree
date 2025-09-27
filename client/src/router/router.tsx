import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router";
import BaseLayout from "../layouts/base-layout";
import Home from "../containers/Home";
import Login from "../containers/Login";
import Register from "../containers/Register";
import TreePage from "../containers/tree/TreePage";
import PublicFamilyPage from "../containers/tree/PublicFamilyPage";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import GetStarted from "../containers/GetStarted";
import FamilyCodeCard from "../components/FamilyCodeCard";

const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  // Note: The login and logout functions should be handled inside the Login/Register/Navbar components,
  // calling the functions provided by the AuthContext.

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <BaseLayout>
          <Navbar />
          <Outlet />
        </BaseLayout>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: isLoggedIn ? <Navigate to="/tree" /> : <Login />,
        },
        {
          path: "register",
          element: isLoggedIn ? <Navigate to="/tree" /> : <Register />,
        },
        {
          path: "tree",
          element: isLoggedIn ? <TreePage /> : <Navigate to="/get-started" />,
        },
        {
          path: "public",
          element: <PublicFamilyPage />,
        },
        {
          path: "get-started",
          element: <GetStarted />,
        },
        {
          path: "family-code",
          element: <FamilyCodeCard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
