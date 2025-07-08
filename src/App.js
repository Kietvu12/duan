import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './Page/HomePage/HomePage';
import Login from './Page/Login/Login';
import Navbar from './Component/Navbar';
import AccountManage from './Page/AccountManage/AccountManage';
import InputForm from './Page/InputForm/InputForm';
import { ProjectProvider, useProject } from './Context/ProjectContext';
import axios from 'axios';
import Register from './Page/Register/Register';


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
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache'
        }
      });
      if (isMounted) {
        setAuthState({
          loading: false,
          isAuthenticated: true,
          userRole: response.data.role
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
}, []);

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
  <ProtectedRoute requiredRole={['system_admin', 'group_admin', 'user']}>
    {children}
  </ProtectedRoute>
);
const GroupAdminUserRoute = ({ children }) => (
  <ProtectedRoute requiredRole={['system_admin', 'group_admin', 'user']}>
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
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <HomePage />
          </ProtectedRoute>
        } />
        
        {/* Admin-only routes */}
        <Route path="/account" element={
          <GroupAdminRoute>
            <Navbar />
            <AccountManage />
          </GroupAdminRoute>
        } />
        
        {/* Group admin or system admin routes */}
        <Route path="/input" element={
          <GroupAdminUserRoute>
            <Navbar />
            <InputForm />
          </GroupAdminUserRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;