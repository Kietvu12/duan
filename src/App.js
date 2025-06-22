import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Page/HomePage/HomePage';
import Login from './Page/Login/Login';
import Navbar from './Component/Navbar';
import AccountManage from './Page/AccountManage/AccountManage';
import InputForm from './Page/InputForm/InputForm';
import { ProjectProvider, useProject } from './Context/ProjectContext';
import { useEffect } from 'react';

function AppWrapper() {
  return (
    <ProjectProvider>
      <App />
    </ProjectProvider>
  );
}

function App() {
  const { fetchUserProfile, loading, authChecked } = useProject();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading || !authChecked) return <div>Đang tải thông tin người dùng...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <Navbar />
            <AccountManage />
          </ProtectedRoute>
        } />
        <Route path="/input" element={
          <ProtectedRoute>
            <Navbar />
            <InputForm />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useProject();
  return user ? children : <Navigate to="/login" />;
};

export default AppWrapper;