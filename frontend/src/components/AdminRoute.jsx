import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const AdminRoute = ({ children }) => {
  const { hasRole, isAuthenticated, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated() && !hasRole('ROLE_ADMIN')) {
      toast.error('Access denied. Admin privileges required.');
      setShouldRedirect(true);
    }
  }, [loading, isAuthenticated, hasRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 to-blush-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-charcoal-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    toast.info('Please login to access admin area.');
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (shouldRedirect || !hasRole('ROLE_ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
