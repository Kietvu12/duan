import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useProject } from '../../Context/ProjectContext';


const InputForm = () => {
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [member, setMember] = useState([])
  const { getAllGroups, createTransaction, getCurrentUser, getTransactionsByGroup, getAllUsers, getGroupMembers } = useProject();
  const [groupList, setGroupList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupInput, setShowPopupInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastFetchedGroup, setLastFetchedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    content: '',
    transaction_type: 'nhan_san',
    related_user: '',
    amount: '',
    points_change: '',
  })
  const [availableUsers, setAvailableUsers] = useState([
    { id: 4, name: "Sarah Connor", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Mike Tyson", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "Emma Watson", avatar: "https://i.pravatar.cc/150?img=6" }
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const inputRef = useRef(null);
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
useEffect(() => {
    if (formData.transaction_type === 'nhan_lich' || formData.transaction_type === 'san_cho') {
      setFormData(prev => ({
        ...prev,
        points_change: prev.points_change.startsWith('-') ? prev.points_change : `-${prev.points_change}`,
        amount: prev.amount.startsWith('-') ? prev.amount : `-${prev.amount}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        points_change: prev.points_change.startsWith('-') ? prev.points_change.slice(1) : prev.points_change,
        amount: prev.amount.startsWith('-') ? prev.amount.slice(1) : prev.amount
      }));
    }
  }, [formData.transaction_type]);

  // Tách số tiền và điểm từ tin nhắn Zalo
  const extractValuesFromContent = (content) => {
    // Tách số tiền (200$, 200k, 200.000đ...)
    const moneyMatch = content.match(/(\d+\.?\d*)\s*(\$|k|đ|₫|vnd)/i);
    const amount = moneyMatch ? moneyMatch[1] : '';
    
    // Tách số điểm (0.5, 0.75, 1.25...)
    const pointMatch = content.match(/(\d+\.\d+)|(\d+)/g);
    const points = pointMatch ? pointMatch[0] : '';
    
    return { amount, points };
  };

  // Xử lý thay đổi nội dung tin nhắn
  const handleContentChange = (e) => {
    const content = e.target.value;
    const { amount, points } = extractValuesFromContent(content);
    
    setFormData(prev => ({
      ...prev,
      content,
      amount: amount || prev.amount,
      points_change: points || prev.points_change
    }));
  };
  
const fetchInitialData = useCallback(async () => {
  try {
    setLoading(true);
    
    // Chỉ lấy users nếu là admin
    const shouldFetchUsers = currentUser?.role === 'system_admin' || currentUser?.role === 'group_admin';
    
    const promises = [getAllGroups({ forAccountManagement: true })]; // Luôn lấy groups
    
    if (shouldFetchUsers) {
      promises.push(getAllUsers());
    }
    
    const results = await Promise.all(promises);
    
    // Xử lý kết quả
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
    fetchInitialData();
  }, [fetchInitialData]);

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
          const members = await getGroupMembers(currentGroup.group_id);
          setMember(members);
        }
      } catch (error) {
        console.log("Error fetching members:", error.message);
      }
    };

    fetchMember();
  }, [currentGroup]);
  console.log("Người tham gia", member)
  
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setSearchQuery('');
  }, []);
  const searchUsers = async (query) => {
    if (!query.trim() || !currentGroup) {
      setFilteredUsers([]);
      return;
    }

    try {
      const members = await getGroupMembers(currentGroup.group_id);
      const filtered = members.filter(user =>
        user.zalo_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUserDropdown(true);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsEditing(false);
      setSearchQuery('');
    }, 200);
  }, []);
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserName(user.username);
    setShowUserDropdown(false);
  };
  const handleSubmit = async () => {
    try {
      if (!currentGroup) {
        alert('Vui lòng chọn nhóm trước');
        return;
      }

      if (!selectedUser) {
        alert('Vui lòng chọn người dùng trước');
        return;
      }

      const transactionData = {
        user_id: selectedUser.user_id,
        group_id: currentGroup.group_id,
        transaction_type: formData.transaction_type,
        points_change: Number(formData.points_change) || 0,
        amount: Number(formData.amount) || 0,
        content: formData.content,
        related_user: formData.related_user,
        transaction_date: new Date().toISOString(),
        created_by: currentUser.user_id
      };

      await createTransaction(transactionData);
      setFormData({
        content: '',
        transaction_type: 'nhan_san',
        related_user: '',
        points_change: '',
        amount: ''
      });

      setSubmitted(false);
      setUserName('');
      setSelectedUser(null);

      alert('Tạo giao dịch thành công!');
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(`Có lỗi xảy ra: ${error.response?.data?.message || error.message}`);
    }
  };
  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      setSearchQuery('');
    }
  }, []);
  const handleGroupSelect = useCallback(group => {
    if (!lastFetchedGroup || lastFetchedGroup.group_id !== group.group_id) {
      setCurrentGroup(group);
      setIsEditing(false);
      setSearchQuery('');
    }
  }, [lastFetchedGroup]);
  const toggleUserSelection = useCallback(user => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  }, []);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  const handleAddGroup = () => {
    console.log("Tạo nhóm mới:", {
      name: newGroupName,
      members: selectedUsers
    });
    setNewGroupName("");
    setSelectedUsers([]);
    setShowAddGroupPopup(false);
  };


  const handleAnalyze = () => {
    const words = formData.message.split(' ');
    setFormData({
      ...formData,
      name: words[0] || '',
      location: words[1] || '',
      amount: words[2] || ''
    });
  };
  if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!currentUser) return <div>No user data</div>;
  

  return (
    <div className="min-h-screen min-w-[300px] flex flex-col items-center justify-center p-6">
      <div className="text-center animate-fade-in">
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
        </div>
        {(currentUser.role === 'system_admin' || currentGroup?.is_group_admin === 1) && (
        <div className="flex items-center justify-center gap-4 w-full max-w-xl mx-auto mb-4">
          <div className="relative flex min-w-[300px] flex-grow items-center bg-white border border-gray-300 rounded-full px-4 py-2">
            <input
              type="text"
              className="flex-grow text-lg outline-none bg-transparent placeholder-gray-500"
              placeholder="Nhập tên người dùng..."
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                searchUsers(e.target.value);
              }}
              onFocus={() => userName && setShowUserDropdown(true)}
              onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
            />

            {/* Dropdown gợi ý người dùng */}
            {showUserDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.user_id}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center"
                    onMouseDown={() => handleSelectUser(user)}
                  >
                    <span className="mr-2">👤</span>
                    <div>
                      <p className="font-medium">{user.zalo_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
            onClick={() => setSubmitted(true)}
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
)}
        {!submitted && (
          <p
            className="text-white font-semibold underline cursor-pointer px-6 py-2 text-lg"
            onClick={() => {
              setSelectedUser({
                user_id: currentUser.id,
                username: currentUser.zaloName
              });
              setUserName(currentUser.zalo_name);
              setSubmitted(true);
            }}
          >
            <span className="text-blue-500 font-semibold cursor-pointer">Tạo bản ghi của tôi</span>
          </p>
        )}
      </div>
      {submitted && (
<div className="w-full max-w-6xl bg-white bg-opacity-80 p-6 rounded-xl shadow-md mt-6 animate-fade-in">
      {/* Trường tin nhắn Zalo (content) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tin nhắn Zalo</label>
        <textarea
          rows={3}
          value={formData.content}
          onChange={handleContentChange}
          className="w-full border border-gray-300 rounded-md p-3"
          placeholder="Nhập tin nhắn (ví dụ: 'Chuyển 200k điểm 0.5')"
        />
      </div>

      <div className="space-y-4">
        {/* Loại giao dịch (transaction_type) */}
        <div>
          <label className="block text-sm font-medium mb-1">Loại giao dịch</label>
          <select
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="nhan_san">Nhận san</option>
            <option value="san_cho">San cho</option>
            <option value="nhan_lich">Nhận lịch</option>
            <option value="giao_lich">Giao lịch</option>
          </select>
        </div>

        {/* Người liên quan (related_user) */}
        <div>
          <label className="block text-sm font-medium mb-1">Người liên quan</label>
          <input
            type="text"
            value={formData.related_user}
            onChange={(e) => setFormData({ ...formData, related_user: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Nhập tên người liên quan (nếu có)"
          />
        </div>

        {/* Điểm thay đổi (points_change) */}
        <div>
          <label className="block text-sm font-medium mb-1">Điểm thay đổi</label>
          <input
            type="number"
            value={formData.points_change}
            onChange={(e) => setFormData({ ...formData, points_change: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Nhập số điểm"
          />
        </div>

        {/* Số tiền (amount) */}
        <div>
          <label className="block text-sm font-medium mb-1">Số tiền</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Nhập số tiền"
          />
        </div>

        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Tạo giao dịch
        </button>
      </div>
    </div>
      )}
      {showAddGroupPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Tạo nhóm mới</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên nhóm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Thành viên</label>
              <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                {availableUsers.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded cursor-pointer ${selectedUsers.some(u => u.id === user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-3"
                    />
                    <span className="text-sm font-medium">
                      {user.name}
                    </span>
                    {selectedUsers.some(u => u.id === user.id) && (
                      <svg className="w-5 h-5 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddGroupPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddGroup}
                disabled={!newGroupName.trim()}
                className={`px-4 py-2 rounded-md text-white ${!newGroupName.trim() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;
