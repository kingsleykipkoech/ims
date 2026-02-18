import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth';

const ProtectedRoutes = ({ allowedRoles }) => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const user = getUser();

    if (!isAuth) {
        // Redirect to login based on intended path or role separation? 
        // Assuming /admin* goes to admin login, others to investor login
        const isAdminPath = location.pathname.startsWith('/admin');
        return <Navigate to={isAdminPath ? "/admin-login" : "/login"} state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
