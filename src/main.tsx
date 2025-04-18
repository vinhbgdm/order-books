import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Layout from './layout';
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import Login from 'pages/client/auth/login';
import Register from 'pages/client/auth/register';
import 'styles/global.scss'
import HomePage from 'pages/client/home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
