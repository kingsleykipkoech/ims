import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth';

const PublicRoutes = () => {
    const isAuth = isAuthenticated();
    const user = getUser();

    if (isAuth) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/investor" replace />;
        }
    }

    return <Outlet />;
};

export default PublicRoutes;
