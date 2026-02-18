import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';

// Pages - to be implemented
import Welcome from './pages/Welcome';
import Login from './pages/investor/Login';
import AdminLogin from './pages/admin/AdminLogin';
import InvestorDashboard from './pages/investor/InvestorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Login isRegister={true} />} /> {/* Reuse Login or separate? */}
        </Route>

        {/* Protected Investor Routes */}
        <Route element={<ProtectedRoutes allowedRoles={['investor']} />}>
          <Route path="/investor/*" element={<InvestorDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
