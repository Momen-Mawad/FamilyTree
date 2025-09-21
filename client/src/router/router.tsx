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
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useScreenSize } from "../context/screenSizeContext";
import treeLoader from "../containers/tree/loader";

const AppRouter = () => {
  const { isLoggedIn, user } = useAuth();
  const isSmallScreen = useScreenSize();

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
          element: isLoggedIn ? <TreePage /> : <Navigate to="/login" />,
          loader: (args) =>
            treeLoader({
              ...args,
              params: { ...args.params, familyId: user?.familyId },
            }),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
