import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [exportFiles, setExportFiles] = useState([]);
  const [showExportList, setShowExportList] = useState(false);

  // Axios instance with base URL and auth header
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  // Add auth token to requests
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Initialize auth token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
   const getExportFiles = async () => {
    try {
      const response = await api.get('/reports');
      setExportFiles(response.data.files);
      setShowExportList(true);
    } catch (err) {
      console.error('Error fetching export files:', err);
    }
  };
  const logout = async () => {
  try {
    await api.post('/auth/logout');
    
    // Xóa token khỏi localStorage hoặc cookie
    localStorage.removeItem('token');
    // Hoặc nếu dùng cookies:
    // document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Xóa thông tin user khỏi state
    // Xóa authorization header mặc định
    delete api.defaults.headers.common['Authorization'];
  } catch (err) {
    console.error('Logout error:', err);
    throw err;
  }
};

  // Hàm tạo báo cáo mới
const generateExportFile = async () => {
  try {
    const response = await api.post('/reports/generate');
    
    if (response.data.success) {
      // Làm mới danh sách file sau khi generate
      await getExportFiles();
      return { success: true, filename: response.data.filename };
    }
    
    return { success: false, error: 'Lỗi khi tạo báo cáo' };
  } catch (err) {
    console.error('Generate report error:', err);
    return { 
      success: false, 
      error: err.response?.data?.error || 'Lỗi khi tạo báo cáo' 
    };
  }
};
  // Auth Functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      setAuthToken(response.data.token);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // User Functions
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/users', userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Đăng ký thất bại');
  }
};
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Group Functions
const getAllGroups = async (options = {}) => {
  try {
    setLoading(true);
    
    // Thêm header xác định trang nếu cần
    const headers = options.forAccountManagement 
      ? { 'X-Request-Page': 'account-management' } 
      : {};
    
    const response = await api.get('/groups', { headers });
    return response.data;
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch groups');
    throw err;
  } finally {
    setLoading(false);
  }
};

  const getGroupById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/groups/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData) => {
    try {
      setLoading(true);
      const response = await api.post('/groups', groupData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addUserToGroup = async (groupId, userId, isGroupAdmin = false) => {
    try {
      setLoading(true);
      const response = await api.post('/groups/add-user', { groupId, userId, isGroupAdmin });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user to group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeUserFromGroup = async (groupId, userId) => {
    try {
      setLoading(true);
      const response = await api.post('/groups/remove-user', { groupId, userId });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove user from group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroupAdminStatus = async (groupId, userId, isGroupAdmin) => {
    try {
      setLoading(true);
      const response = await api.post('/groups/update-admin', { groupId, userId, isGroupAdmin });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin status');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getGroupMembers = async (groupId) => {
  try {
    setLoading(true);
    const response = await api.get(`/groups/${groupId}/members`);
    return response.data;
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch group members');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Transaction Functions
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByUser = async (userId, groupId = null) => {
    try {
      setLoading(true);
      const url = `/transactions/user/${userId}${groupId ? `?groupId=${groupId}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByGroup = async (groupId) => {
    try {
      setLoading(true);
      const response = await api.get(`/transactions/group/${groupId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch group transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    error,
    clearError: () => setError(null),
    // Auth
    login,
    logout,
    getCurrentUser,
    // Users
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    // Groups
    getAllGroups,
    getGroupById,
    createGroup,
    addUserToGroup,
    removeUserFromGroup,
    updateGroupAdminStatus,
    getGroupMembers,
    // Transactions
    createTransaction,
    getTransactionsByUser,
    getTransactionsByGroup,
      exportFiles,
        showExportList,
        setShowExportList,
        getExportFiles,
        generateExportFile,
        register
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);