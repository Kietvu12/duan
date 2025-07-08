import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../Component/Navbar';
import TransactionHistory from '../../Component/TransactionHistory';
import { useProject } from '../../Context/ProjectContext';
import AddUserToGroupPopup from '../../Component/InputForm';


export default function HomePage() {
  const [error, setError] = useState(null);
  // State và hooks từ props/context
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { getAllGroups, getTransactionsByGroup, getAllUsers, getCurrentUser, createGroup, exportFiles,
    showExportList,
    setShowExportList,
    getExportFiles,
    generateExportFile } = useProject();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Các state khác từ code hiện có
  const [groupList, setGroupList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupInput, setShowPopupInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedGroup, setLastFetchedGroup] = useState(null);
  const inputRef = useRef(null);


  // Sử dụng các hook useEffect và useCallback từ code hiện có
  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch current user', error);
        }
      }
    };


    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);
  console.log();
  
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      const shouldFetchUsers = currentUser?.role === 'system_admin' || currentUser?.role === 'group_admin';

      const promises = [getAllGroups()];

      if (shouldFetchUsers) {
        promises.push(getAllUsers());
      }

      const results = await Promise.all(promises);

      const groups = results[0];
      const users = shouldFetchUsers ? results[1] : [];

      setGroupList(groups);
      if (shouldFetchUsers) {
        setAllUsers(users);
      }

      if (!currentGroup || !groups.some(g => g.group_id === currentGroup.group_id)) {
        setCurrentGroup(groups.length > 0 ? groups[0] : null);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }

  }, [currentGroup, currentUser?.role]);
  useEffect(() => {
    setFilteredGroups(
      searchQuery.trim() === ''
        ? []
        : groupList.filter(group =>
          group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, groupList]);
      const handleExportClick = () => {
    getExportFiles();
  };
  const fetchTransactions = useCallback(async () => {
    if (!currentGroup || (lastFetchedGroup && lastFetchedGroup.group_id === currentGroup.group_id)) {
      return;
    }

    try {
      setLoading(true);
      const transactionsData = await getTransactionsByGroup(currentGroup.group_id);
      setTransactions(transactionsData);
      setLastFetchedGroup(currentGroup);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [currentGroup, getTransactionsByGroup, lastFetchedGroup]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Tính toán memberStats từ transactions và allUsers
  const memberStats = useMemo(() => {
    const stats = {};
    transactions.forEach(transaction => {
      const userId = transaction.user_id;
      if (!stats[userId]) {
        const user = allUsers.find(u => u.user_id === userId) || {
          user_id: userId,
          zalo_name: `User ${userId}`,
        };
        stats[userId] = {
          userId,
          zalo_name: user.zalo_name || `User ${userId}`,
          avatar: user.avatar || `https://i.pravatar.cc/150?u=${userId}`,
          totalPoints: 0,
          totalAmount: 0,
          transactions: 0,
        };
      }
      stats[userId].totalPoints += transaction.points_change || 0;
      stats[userId].totalAmount += parseFloat(transaction.amount) || 0;
      stats[userId].transactions += 1;
    });
    return Object.values(stats);
  }, [transactions, allUsers]);

  // Sắp xếp dữ liệu
  const sortedData = useMemo(() => {
    if (!sortConfig) return memberStats;
    return [...memberStats].sort((a, b) => {
      const keyMap = {
        'Tên Zalo': 'zalo_name',
        'Điểm': 'totalPoints',
        '$$': 'totalAmount',
        GD: 'transactions',
      };
      const key = keyMap[sortConfig.key] || 'zalo_name';
      if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [memberStats, sortConfig]);

  // Lọc dữ liệu theo search term
  const filteredData = useMemo(() => {
    return sortedData.filter(member =>
      member.zalo_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Xử lý thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý thay đổi số item mỗi trang
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Tạo số trang cho phân trang
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 4) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setSearchQuery('');
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsEditing(false);
      setSearchQuery('');
    }, 200);
  }, []);

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      setSearchQuery('');
    }
  }, []);
  const toggleUserSelection = useCallback(user => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.user_id)
        ? prev.filter(u => u.id !== user.user_id)
        : [...prev, user]
    );
  }, []);
  const handleGroupSelect = useCallback(group => {
    if (!lastFetchedGroup || lastFetchedGroup.group_id !== group.group_id) {
      setCurrentGroup(group);
      setIsEditing(false);
      setSearchQuery('');
    }
  }, [lastFetchedGroup]);
  console.log("Nhóm thành viên", allUsers);

const isAdmin = currentUser?.role === 'system_admin' || currentUser?.role === 'group_admin';
  // Lọc bỏ currentUser khỏi danh sách chọn thành viên
  const availableUsers = allUsers.filter(user => user.id !== currentUser?.id);
  // Render loading hoặc empty states
  if (loading) {
    return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  }

  if (!currentGroup) {
    return <div className="text-center py-4">Vui lòng chọn nhóm</div>;
  }

  return (
    <div className="min-h-screen px-8 py-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 font-sans text-sm text-gray-700">
      <div className="px-8 py-4">
        <h1 className="text-4xl font-regular mb-4">Bảng tổng kết điểm</h1>
        <div className="flex items-center mb-4">
          {currentGroup ? (
            isEditing ? (
              <div className="relative w-full max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="text-2xl font-bold focus:outline-none border-b-2 border-blue-500 w-full p-2"
                  placeholder="Tìm kiếm nhóm..."
                />

                {/* Dropdown gợi ý tìm kiếm */}
                {searchQuery && filteredGroups.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredGroups.map(group => (
                      <div
                        key={group.group_id}
                        className="p-3 hover:bg-blue-50 cursor-pointer flex items-center"
                        onMouseDown={() => handleGroupSelect(group)}
                      >
                        <span className="mr-2">🏢</span>
                        <span>{group.group_name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && filteredGroups.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3 text-gray-500">
                    Không tìm thấy nhóm phù hợp
                  </div>
                )}
              </div>
            ) : (
              <h2
                className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
                onDoubleClick={handleDoubleClick}
              >
                {currentGroup.group_name}
              </h2>
            )
          ) : (
            <p className="text-gray-500">Đang tải thông tin nhóm...</p>
          )}
          {isAdmin && (
            <>
          <button
            onClick={() => setShowAddGroupPopup(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Thêm nhóm mới"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          </> )}
        </div>


        <div className="flex items-center gap-3 mb-6 ">
          <span className="text-sm font-medium text-gray-600">Chốt đến</span>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="time"
                className="w-28 h-8 bg-white border border-gray-200 rounded-md px-2 pl-8 pr-2 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
              />
              <span className="absolute left-2 top-1.5 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 15 14"></polyline>
                </svg>
              </span>
            </div>

            {/* Ô chọn ngày - compact */}
            <div className="relative">
              <input
                type="date"
                className="h-8 bg-white border border-gray-200 rounded-md px-2 pl-8 pr-2 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
              />
              <span className="absolute left-2 top-1.5 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 mb-6 border-l-4 border-blue-400 p-4 rounded-md shadow-sm">
          <div className="flex items-start">
            <div className="ml-3">
              <div className="mt-1 text-sm text-blue-700 space-y-1">
                <p>• Mọi thắc mắc phản hồi trước 24h - Sau 24h không giải quyết</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Hiển thị</span>
            <select
              className="bg-white border rounded-md px-3 py-1 text-xs shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-xs text-gray-600">mục/trang</span>
          </div>
          <input
            className="flex-1 px-4 py-1 border rounded-full shadow-sm text-sm"
            placeholder="Search theo tên Zalo..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {isAdmin && (
            <>
          <button
            onClick={() => setShowPopupInput(true)}
            className="bg-blue-400 px-4 py-1 rounded-full text-xs text-white shadow hover:bg-blue-500 transition-colors"
          >
            + Add
          </button>
           <button 
        onClick={handleExportClick}
        className="bg-white border px-4 py-1 rounded-full text-xs shadow hover:bg-gray-50 transition-colors"
      >
        Export
      </button>
      </>
          )}
          {showExportList && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="p-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Báo cáo đã lưu</span>
                  <button
                    onClick={() => setShowExportList(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {exportFiles.length > 0 ? (
                  exportFiles.map((file, index) => (
                    <a
                      key={index}
                      href={`/api/reports/download/${file.name}`} // Hoặc sử dụng API download
                      download
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      <div className="flex justify-between">
                        <span className="truncate">{file.name.replace('.xlsx', '')}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(file.date).toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Chưa có báo cáo nào
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-gray-200">
                <button
                  onClick={generateExportFile}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  + Tạo báo cáo mới
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                {['Tên Zalo', 'Điểm', '$$', 'GD'].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider hover:bg-blue-100 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center justify-between">
                      {header}
                      <div className="ml-2 flex flex-col">
                        <svg
                          className={`w-3 h-3 ${sortConfig?.key === header && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <svg
                          className={`w-3 h-3 ${sortConfig?.key === header && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((member, idx) => (
                  <tr
                    onClick={() => {
                      setShowPopup(true);
                      setSelectedUserId(member.userId);
                    }}
                    key={idx}
                    className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.zalo_name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {member.zalo_name}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${member.totalPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {member.totalPoints}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${member.totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {member.totalAmount.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {member.transactions}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị từ <span className="font-medium">{indexOfFirstItem + 1}</span> tới{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> của{' '}
              <span className="font-medium">{filteredData.length}</span> dữ liệu
            </div>
            <div className="flex space-x-1">
              <button
                className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                &lt;
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={index} className="w-10 h-8 flex items-center justify-center text-gray-400">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={index}
                    className={`w-10 h-8 rounded-md text-sm ${page === currentPage
                        ? 'bg-blue-400 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => paginate(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Popups */}
        {showPopup && selectedUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Thông tin chi tiết</h3>
              <p>Đang xem thông tin user ID: {selectedUserId}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                  onClick={() => setShowPopup(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute w-6 h-6 top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <TransactionHistory
              groupId={currentGroup?.group_id}
              userId={selectedUserId}
            />
          </div>
        </div>
      )}
      {showPopupInput && (
        <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 bg-opacity-10 flex justify-center items-center z-50">
          <div className="">
            <button
              onClick={() => setShowPopupInput(false)}
              className="absolute w-6 h-6 top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <AddUserToGroupPopup groupId={currentGroup.group_id} onClose={() => setShowPopupInput(false)} />
          </div>
        </div>
      )}
      {showAddGroupPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Tạo nhóm mới</h3>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm*</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên nhóm (bắt buộc)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành viên (tùy chọn)
              </label>
              <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                {allUsers
                  .filter(user => user.id !== currentUser?.id)
                  .map(user => (
                    <div
                      key={user.user_id}
                      className={`flex items-center p-2 rounded cursor-pointer ${selectedUsers.some(u => u.user_id === user.user_id)
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                        }`}
                      onClick={() => {
                        // Sửa lại hàm toggle chọn từng người
                        setSelectedUsers(prev => {
                          const isSelected = prev.some(u => u.user_id === user.user_id);
                          if (isSelected) {
                            return prev.filter(u => u.user_id !== user.user_id);
                          } else {
                            return [...prev, user];
                          }
                        });
                      }}
                    >
                      <img
                        src={user.avatar || 'https://i.pravatar.cc/150?img=3'}
                        alt={user.zalo_name || user.email}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.zalo_name || user.email}
                        </p>
                        {user.email && user.zalo_name && (
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        )}
                      </div>
                      {selectedUsers.some(u => u.id === user.user_id) && (
                        <svg
                          className="w-5 h-5 ml-2 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setNewGroupName('');
                  setSelectedUsers([]);
                  setShowAddGroupPopup(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(null);

                    await createGroup({ group_name: newGroupName });

                    setNewGroupName('');
                    setSelectedUsers([]);
                    setShowAddGroupPopup(false);

                  } catch (err) {
                    setError(err.response?.data?.message || 'Tạo nhóm thất bại');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={!newGroupName.trim() || loading}
                className={`px-4 py-2 rounded-md text-white transition-colors ${!newGroupName.trim() || loading
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Đang tạo...' : 'Tạo nhóm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
