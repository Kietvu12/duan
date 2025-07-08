import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../Context/ProjectContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { getCurrentUser, logout } = useProject(); // Thêm hàm logout từ context

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch current user', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const isAdmin = currentUser?.role === 'system_admin' || currentUser?.role === 'group_admin';

  // Hàm lấy chữ cái đầu cho avatar
  const getInitial = () => {
    if (!currentUser) return '';
    return currentUser.zalo_name?.charAt(0) || currentUser.email?.charAt(0) || 'U';
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logout(); // Gọi hàm logout từ context
      navigate('/login'); // Chuyển hướng về trang login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-transparent">
      <div 
        className="text-2xl font-bold text-black flex items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        COMPANY
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-[40px] shadow-sm">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-[40px] transition-all duration-200 ${
              isActive('/') 
                ? 'bg-black text-white' 
                : 'text-gray-900 hover:bg-black hover:bg-opacity-10'
            }`}
            onClick={() => navigate('/')}
          >
            Giao dịch
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-[40px] transition-all duration-200 ${
              isActive('/input') 
                ? 'bg-black text-white' 
                : 'text-gray-900 hover:bg-black hover:bg-opacity-10'
            }`}
            onClick={() => navigate('/input')}
          >
            Tạo mới bản ghi
          </button>
          {isAdmin && (
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-[40px] transition-all duration-200 ${
                isActive('/account') 
                  ? 'bg-black text-white' 
                  : 'text-gray-900 hover:bg-black hover:bg-opacity-10'
              }`}
              onClick={() => navigate('/account')}
            >
              Quản lý tài khoản
            </button>
          )}
        </div>
        
        {/* Notification icon */}
        <button className="p-2 text-gray-700 hover:bg-black hover:bg-opacity-10 rounded-full transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Settings icon */}
        <button className="p-2 text-gray-700 hover:bg-black hover:bg-opacity-10 rounded-full transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Avatar và dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              <span>{getInitial()}</span>
            </div>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.zalo_name || currentUser?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.role === 'system_admin' ? 'Quản trị hệ thống' : 
                   currentUser?.role === 'group_admin' ? 'Quản trị nhóm' : 'Thành viên'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Navbar;