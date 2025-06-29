import React, { useState, useEffect } from 'react';
import { useProject } from '../Context/ProjectContext';

const AddUserToGroupPopup = ({ groupId, onClose }) => {
  const { getAllUsers, getGroupById, addUserToGroup } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, group] = await Promise.all([
          getAllUsers(),
          getGroupById(groupId)
        ]);
        setAllUsers(users);
        setGroupMembers(group.members || []);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId, getAllUsers, getGroupById]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers([]);
    } else {
      const filtered = allUsers.filter(user => 
        !groupMembers.some(member => member.user_id === user.user_id) && // Chỉ hiển thị user chưa có trong nhóm
        (user.zalo_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers, groupMembers]);

  const handleAddUser = async (userId) => {
    try {
      setLoading(true);
      await addUserToGroup(groupId, userId);
      // Cập nhật lại danh sách thành viên sau khi thêm
      const group = await getGroupById(groupId);
      setGroupMembers(group.members || []);
      setSearchQuery('');
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm người dùng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Thêm thành viên vào nhóm</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bằng tên hoặc email..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>

        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div 
                key={user.user_id} 
                className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => handleAddUser(user.user_id)}
              >
                <div className="flex items-center">
                  <img
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.user_id}`}
                    alt={user.zalo_name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{user.zalo_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddUser(user.user_id);
                  }}
                >
                  Thêm
                </button>
              </div>
            ))
          ) : searchQuery ? (
            <div className="p-3 text-center text-gray-500">
              {loading ? 'Đang tìm kiếm...' : 'Không tìm thấy người dùng phù hợp'}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500">
              Nhập tên hoặc email để tìm kiếm
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
