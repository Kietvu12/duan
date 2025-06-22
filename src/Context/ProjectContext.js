// contexts/ProjectContext.js
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setAuthChecked(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Đăng nhập thất bại' 
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Đổi mật khẩu thất bại'
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      } catch (error) {
        logout();
      } finally {
        setAuthChecked(true);
      }
    } else {
      setAuthChecked(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthChecked(true);
  };

  return (
    <ProjectContext.Provider value={{
      user,
      loading,
      authChecked,
      login,
      changePassword,
      fetchUserProfile,
      logout
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);