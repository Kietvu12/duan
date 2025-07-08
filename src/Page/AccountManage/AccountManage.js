import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../Component/Navbar';
import TransactionHistory from '../../Component/TransactionHistory';
import InputForm from '../InputForm/InputForm';
import AccountInfo from '../../Component/AccountInfor';
import { useProject } from '../../Context/ProjectContext';
import AddUserToGroupPopup from '../../Component/InputForm';


export default function AccountManage() {
  const [selectedUserId, setSelectedUserId] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { getAllGroups, getTransactionsByGroup, getAllUsers, getGroupMembers, removeUserFromGroup, deleteUser, updateGroupAdminStatus} = useProject();
  const [groupList, setGroupList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [member, setMember] = useState([])
  const [sortConfig, setSortConfig] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupInput, setShowPopupInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');;
  const [showRoleDropdown, setShowRoleDropdown] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([
    { id: 4, name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, name: 'Mike Tyson', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 6, name: 'Emma Watson', avatar: 'https://i.pravatar.cc/150?img=6' },
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedGroup, setLastFetchedGroup] = useState(null);
  const inputRef = useRef(null);
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [users, groups] = await Promise.all([getAllUsers(), getAllGroups({ forAccountManagement: true })]);
      setAllUsers(users);
      setGroupList(groups);
      if (!currentGroup || !groups.some(g => g.group_id === currentGroup.group_id)) {
        setCurrentGroup(groups.length > 0 ? groups[0] : null);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentGroup]);
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

  useEffect(() => {
    setFilteredGroups(
      searchQuery.trim() === ''
        ? []
        : groupList.filter(group =>
          group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, groupList]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (currentGroup?.group_id) {
          const member = await getGroupMembers(currentGroup.group_id);
          setMember(member);
        }
      } catch (error) {
        console.log("Error fetching member:", error.message);
      }
    };

    fetchMember();
  }, [currentGroup]);
  console.log("Người tham gia", member)
  // Memoized handlers
  const handleGroupSelect = useCallback(group => {
    if (!lastFetchedGroup || lastFetchedGroup.group_id !== group.group_id) {
      setCurrentGroup(group);
      setIsEditing(false);
      setSearchQuery('');
    }
  }, [lastFetchedGroup]);
  const handleSort = (key) => {
    if (key === 'Thao tác') return;

    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Hàm thay đổi vai trò
const handleRoleChange = async (userId, newRole) => {
  try {
    if (!currentGroup?.group_id) {
      alert('Vui lòng chọn nhóm trước');
      return;
    }

    const isGroupAdmin = newRole === 'group_admin' ? 1 : 0;
    
    // Gọi API từ ProjectContext
    await updateGroupAdminStatus(
      currentGroup.group_id,
      userId,
      isGroupAdmin
    );

    // Cập nhật UI ngay lập tức
    setMember(member.map(member => 
      member.user_id === userId 
        ? { 
            ...member, 
            is_group_admin: isGroupAdmin,
            role: isGroupAdmin ? 'group_admin' : 'user'
          } 
        : member
    ));

    setShowRoleDropdown(null);
    alert('Cập nhật vai trò thành công!');
  } catch (error) {
    console.error('Error updating role:', error);
    alert(error.response?.data?.message || 'Có lỗi khi cập nhật vai trò');
  }
};

  // Hàm xóa thành viên
  const handleDelete = async (userId, type) => {
    try {
      if (type === 'remove') {
        await removeUserFromGroup(currentGroup.group_id, userId,);
      } else {
        await deleteUser(userId);
      }
      setMember(member.filter(member => member.user_id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Xử lý dữ liệu trước khi hiển thị
 const processedMembers = useMemo(() => {
    let filteredMembers = [...member];

    // Tìm kiếm theo tên Zalo
    if (searchTerm.trim() !== '') {
      filteredMembers = filteredMembers.filter(m => 
        m.zalo_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sắp xếp
    if (sortConfig !== null) {
      filteredMembers.sort((a, b) => {
        if (sortConfig.key === 'Tên Zalo') {
          return sortConfig.direction === 'asc' 
            ? a.zalo_name.localeCompare(b.zalo_name)
            : b.zalo_name.localeCompare(a.zalo_name);
        }
        else if (sortConfig.key === 'Điểm') {
          return sortConfig.direction === 'asc'
            ? a.points - b.points
            : b.points - a.points;
        }
        else if (sortConfig.key === 'Vai trò') {
          return sortConfig.direction === 'asc'
            ? (a.is_group_admin ? 1 : 0) - (b.is_group_admin ? 1 : 0)
            : (b.is_group_admin ? 1 : 0) - (a.is_group_admin ? 1 : 0);
        }
        return 0;
      });
    }

    return filteredMembers.map(member => ({
      id: member.user_id,
      name: member.zalo_name,
      avatar: `https://i.pravatar.cc/150?u=${member.email}`,
      leftPoint: member.points,
      role: member.is_group_admin ? 'group admin' : 'user',
      email: member.email,
      isGroupAdmin: member.is_group_admin
    }));
  }, [member, sortConfig, searchTerm]);

  // Tính toán phân trang
  const totalItems = processedMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = processedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm thay đổi trang
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };


  const toggleUserSelection = useCallback(user => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  }, []);



  const membertats = useMemo(() => {
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

  const sortedData = useMemo(() => {
    if (!sortConfig) return membertats;
    return [...membertats].sort((a, b) => {
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
  }, [membertats, sortConfig]);

  // UI handlers
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

  // Render loading or empty states
  if (loading) {
    return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  }

  if (!currentGroup) {
    return <div className="text-center py-4">Vui lòng chọn nhóm</div>;
  }
  return (
    <div className="min-h-screen px-8 py-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 font-sans text-sm text-gray-700">
      <div className="px-8 py-4">
        <h1 className="text-4xl font-regular mb-4">Danh sách thành viên</h1>
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
                        onMouseDown={() => handleGroupSelect(group)} // Sử dụng onMouseDown thay vì onClick
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
          {/* <button
            onClick={() => setShowAddGroupPopup(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Thêm nhóm mới"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button> */}
        </div>


        {/* Filters */}
<div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Hiển thị</span>
          <select
            className="bg-white border rounded-md px-3 py-1 text-xs shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset về trang đầu khi thay đổi số item/trang
            }}
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="text-xs text-gray-600">mục/trang</span>
        </div>

        {/* Ô tìm kiếm */}
        <input
          className="flex-1 px-4 py-1 border rounded-full shadow-sm text-sm"
          placeholder="Tìm kiếm theo tên Zalo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
          }}
        />

        <button 
          onClick={() => setShowPopupInput(true)} 
          className="bg-blue-400 px-4 py-1 rounded-full text-xs text-white shadow hover:bg-blue-500"
        >
          + Thêm thành viên
        </button>
      </div>


        {/* Table */}
<div className="bg-white rounded-xl overflow-hidden shadow">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Phần header giữ nguyên từ code gốc */}
          <thead className="bg-blue-50">
            <tr>
              {['Tên Zalo', 'Điểm', 'Vai trò', 'Thao tác'].map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider hover:bg-blue-100 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center justify-between">
                    {header}
                    {header !== 'Thao tác' && (
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
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Phần body với dữ liệu đã phân trang */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((person) => (
                <tr key={person.id} className="hover:bg-blue-50 transition-colors duration-150">
                  {/* Các cột dữ liệu giữ nguyên từ code gốc */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {person.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {person.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {person.leftPoint}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap relative">
                    {/* Dropdown vai trò giữ nguyên */}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {/* Các nút thao tác giữ nguyên */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500">
                  {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong tổng số{' '}
            <span className="font-medium">{totalItems}</span> thành viên
          </div>
          
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`w-10 h-8 rounded-md text-sm ${
                    currentPage === pageNum
                      ? 'bg-blue-400 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      )}
      </div>
            {showPopupInput && (
              <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 bg-opacity-10 flex justify-center items-center z-50">
                <div className="">
                  <button
                    onClick={() => setShowPopupInput(false)}
                    className="absolute w-6 h-6 top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                  <AddUserToGroupPopup groupId={currentGroup.group_id} />
                </div>
              </div>
            )}
    </div>
  );
}
