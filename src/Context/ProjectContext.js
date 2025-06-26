import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Thêm hàm kiểm tra auth khi khởi động app
  useEffect(() => {
    const checkAuth = async () => {
      await fetchUserProfile();
    };
    checkAuth();
  }, []);

  // Tự động lấy danh sách nhóm khi user thay đổi
  useEffect(() => {
    if (user) {
      getAllGroup();
    }
  }, [user]);

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

  const getAllGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setGroupsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroupList(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhóm:', error);
      // Xử lý khi token hết hạn
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setGroupsLoading(false);
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
    if (!token) {
      setAuthChecked(true);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setAuthChecked(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setGroupList([]);
  };

  return (
    <ProjectContext.Provider
      value={{
        user,
        loading,
        authChecked,
        groupList,
        groupsLoading,
        login,
        changePassword,
        fetchUserProfile,
        logout,
        getAllGroup
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);