import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './Page/HomePage/HomePage';
import Login from './Page/Login/Login';
import Navbar from './Component/Navbar';
import AccountManage from './Page/AccountManage/AccountManage';
import InputForm from './Page/InputForm/InputForm';
import { ProjectProvider, useProject } from './Context/ProjectContext';

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { getCurrentUser } = useProject();
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    userRole: null
  });

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setAuthState({
            loading: false,
            isAuthenticated: true,
            userRole: user.role
          });
        }
      } catch (err) {
        if (isMounted) {
          setAuthState({
            loading: false,
            isAuthenticated: false,
            userRole: null
          });
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [getCurrentUser]); // Thêm dependency

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(authState.userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Role-based route components
const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="system_admin">
    {children}
  </ProtectedRoute>
);

const GroupAdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole={['system_admin', 'group_admin']}>
    {children}
  </ProtectedRoute>
);

function AppWrapper() {
  return (
    <ProjectProvider>
      <App />
    </ProjectProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <HomePage />
          </ProtectedRoute>
        } />
        
        {/* Admin-only routes */}
        <Route path="/account" element={
          <AdminRoute>
            <Navbar />
            <AccountManage />
          </AdminRoute>
        } />
        
        {/* Group admin or system admin routes */}
        <Route path="/input" element={
          <GroupAdminRoute>
            <Navbar />
            <InputForm />
          </GroupAdminRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;