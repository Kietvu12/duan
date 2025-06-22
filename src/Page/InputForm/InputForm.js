import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

const InputForm = () => {
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState("Nhóm PIONEER 1-1");
    const [isEditing, setIsEditing] = useState(false);
    const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    type: 'Nhận san',
    name: '',
    location: '',
    amount: ''
  });
    const [availableUsers, setAvailableUsers] = useState([
      { id: 4, name: "Sarah Connor", avatar: "https://i.pravatar.cc/150?img=4" },
      { id: 5, name: "Mike Tyson", avatar: "https://i.pravatar.cc/150?img=5" },
      { id: 6, name: "Emma Watson", avatar: "https://i.pravatar.cc/150?img=6" }
    ]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const inputRef = useRef(null);
  
    // Xử lý double click để chỉnh sửa tên nhóm
    const handleDoubleClick = () => {
      setIsEditing(true);
    };
  
    // Xử lý khi blur khỏi input
    const handleBlur = () => {
      setIsEditing(false);
      // Có thể thêm logic lưu tên nhóm vào API ở đây
    };
  
    // Xử lý khi nhấn Enter
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
      }
    };
  
    // Focus vào input khi bắt đầu chỉnh sửa
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);
  
    // Xử lý thêm nhóm mới
    const handleAddGroup = () => {
      console.log("Tạo nhóm mới:", {
        name: newGroupName,
        members: selectedUsers
      });
      // Reset form và đóng popup
      setNewGroupName("");
      setSelectedUsers([]);
      setShowAddGroupPopup(false);
      // Có thể thêm logic gọi API ở đây
    };
  
    // Xử lý chọn/bỏ chọn user
    const toggleUserSelection = (user) => {
      setSelectedUsers(prev => 
        prev.some(u => u.id === user.id)
          ? prev.filter(u => u.id !== user.id)
          : [...prev, user]
      );
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

  return (
    <div className="min-h-screen min-w-[300px] flex flex-col items-center justify-center p-6">
      <div className="text-center animate-fade-in">
                <div className="flex items-center mb-4">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold focus:outline-none"
          />
        ) : (
          <h2 
            className="text-2xl font-bold cursor-pointer"
            onDoubleClick={handleDoubleClick}
          >
            {groupName}
          </h2>
        )}
         <button
        onClick={() => setShowAddGroupPopup(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Thêm nhóm mới"
      >
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      </div>
        <div className="flex items-center justify-center gap-4 w-full max-w-xl mx-auto mb-4">
          <div className="flex min-w-[300px] flex-grow items-center bg-white border border-gray-300 rounded-full px-4 py-2">
            <input
              type="text"
              className="flex-grow text-lg outline-none bg-transparent placeholder-gray-500"
              placeholder="Nhập tên người dùng..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
            onClick={() => setSubmitted(true)}
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
        {!submitted && (
          <p
            className="text-white font-semibold underline cursor-pointer px-6 py-2 text-lg"
            onClick={() => {
              setUserName('');
              setSubmitted(true);
            }}
          >
            <span className="text-blue-500 font-semibold cursor-pointer">Tạo bản ghi của tôi</span>
          </p>
        )}
      </div>

      {submitted && (
        <div className="w-full max-w-6xl bg-white bg-opacity-80 p-6 rounded-xl shadow-md mt-6 animate-fade-in">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tin nhắn Zalo</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="Nhập tin nhắn..."
            ></textarea>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loại giao dịch</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option>Nhận san</option>
                <option>Nhận lịch</option>
                <option>Giao lịch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tên người</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Điểm</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Số tiền</label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              OK
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
