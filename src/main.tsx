import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./layout";
import BookPage from "pages/client/book";
import AboutPage from "pages/client/about";
import Login from "pages/client/auth/login";
import Register from "pages/client/auth/register";
import "styles/global.scss";
import HomePage from "pages/client/home";
import { App } from "antd";
import { AppProvider } from "components/context/app.context";
import ProtectedRoute from "components/auth";
import LayoutAdmin from "components/layout/layout.admin";
import DashBoardPage from "pages/admin/dashboard";
import ManageBookPage from "pages/admin/manage.book";
import ManageOrderPage from "pages/admin/manage.order";
import ManageUserPage from "pages/admin/manage.user";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/book",
                element: <BookPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/checkout",
                element: (
                    <ProtectedRoute>
                        <div className="">Checkout page</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <div className="">Admin page</div>
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/admin",
        element: <LayoutAdmin />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <DashBoardPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "book",
                element: (
                    <ProtectedRoute>
                        <ManageBookPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "order",
                element: (
                    <ProtectedRoute>
                        <ManageOrderPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "user",
                element: (
                    <ProtectedRoute>
                        <ManageUserPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <RouterProvider router={router} />
            </AppProvider>
        </App>
    </StrictMode>,
);
