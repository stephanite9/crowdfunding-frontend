import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "../styles.css";

import HomePage from './pages/HomePage.jsx'; 
import FundraiserPage from './pages/FundraiserPage.jsx';
import CreateFundraiserPage from './pages/CreateFundraiserPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateUserPage from './pages/CreateUserPage.jsx';
import UserPage from './pages/UserPage.jsx';
import UpdateFundraiserPage from './pages/UpdateFundraiserPage.jsx';
import UpdateUserPage from './pages/UpdateUserPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import BrowseFundraisersPage from './pages/BrowseFundraisersPage.jsx'; // added

import NavBar from './components/NavBar.jsx';
import { AuthProvider } from './components/AuthProvider.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/fundraisers", element: <BrowseFundraisersPage /> }, // added browse page
      { path: "/fundraisers/:id", element: <FundraiserPage /> },
      { path: "/createfundraiser", element: <CreateFundraiserPage /> },
      { path: "/createuser", element: <CreateUserPage /> },
      { path: "/users/:id", element: <UserPage /> },
      { path: "/fundraisers/:id/update", element: <UpdateFundraiserPage /> },
      { path: "/users/:id/update", element: <UpdateUserPage /> },
      { path: "*", element: <NotFoundPage /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);