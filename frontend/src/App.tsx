import AppLayout from "./layout/appLayout.tsx";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ProductPage from "./pages/product";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedLayout from "./components/protectedLayout";
import RedirectIfAuthenticated from "./components/redirectIfAuthenticated";
import HomeLayout from "./layout/homeLayout.tsx";
import OrdersPage from "./pages/orders.tsx";
import OrderDetailsPage from "./pages/orderDetailsPage.tsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Navigate to="/public" replace /> },
        {
          path: "public",
          element: <div className="">test public</div>,
        },
        {
          path: "login",
          element: (
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          ),
        },
        {
          path: "home",
          element: (
            <ProtectedLayout>
              <HomeLayout />
            </ProtectedLayout>
          ),
          children: [
            { index: true, element: <Navigate to="/home/dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "products", element: <ProductPage /> },
            {
              path: "orders",
              children: [
                { index: true, element: <OrdersPage /> },
                { path: ":id", element: <OrderDetailsPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
