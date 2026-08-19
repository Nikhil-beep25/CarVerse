import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.AuthStateData);

  if (!user) {
    // If not logged in, redirect to admin login page
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    // If logged in but not an admin, redirect to user dashboard or home
    // We could also show an unauthorized page, but redirecting to home is common
    return <Navigate to="/admin/login" replace />;
  }

  // If user is admin, allow access to the route
  return children;
};

export default AdminProtectedRoute;
