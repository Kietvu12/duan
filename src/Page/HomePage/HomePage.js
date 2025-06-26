import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../Component/Navbar';
import TransactionHistory from '../../Component/TransactionHistory';
import InputForm from '../../Component/InputForm';import { useProject } from '../../Context/ProjectContext';

const people = [
  {
    name: "Ksenia Bair",
    job: "Fullstack Engineer",
    department: "Engineering",
    site: "Miami",
    salary: "$1,500",
    startDate: "Oct 13, 2023",
    lifecycle: "+1.2",
    status: "Absent",
    avatar: "https://i.pravatar.cc/150?img=1",
    selected: true
  },
  {
    name: "Ksenia Bair",
    job: "Fullstack Engineer",
    department: "Engineering",
    site: "Miami",
    salary: "$1,500",
    startDate: "Oct 13, 2023",
    lifecycle: "-1.5",
    status: "Absent",
    avatar: "https://i.pravatar.cc/150?img=1",
    selected: true
  }, {
    name: "Ksenia Bair",
    job: "Fullstack Engineer",
    department: "Engineering",
    site: "Miami",
    salary: "$1,500",
    startDate: "Oct 13, 2023",
    lifecycle: "+0.6",
    status: "Absent",
    avatar: "https://i.pravatar.cc/150?img=1",
    selected: true
  }, {
    name: "Ksenia Bair",
    job: "Fullstack Engineer",
    department: "Engineering",
    site: "Miami",
    salary: "$1,500",
    startDate: "Oct 13, 2023",
    lifecycle: "-0.75",
    status: "Absent",
    avatar: "https://i.pravatar.cc/150?img=1",
    selected: true
  }, {
    name: "Ksenia Bair",
    job: "Fullstack Engineer",
    department: "Engineering",
    site: "Miami",
    salary: "$1,500",
    startDate: "Oct 13, 2023",
    lifecycle: "+0.5",
    status: "Absent",
    avatar: "https://i.pravatar.cc/150?img=1",
    selected: true
  },
  // Thêm các dòng dữ liệu khác tương tự...
];

export default function HomePage() {
 const { groupList, groupsLoading, user } = useProject();
 console.log(groupList);
 
  
  const [sortConfig, setSortConfig] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupInput, setShowPopupInput] = useState(false);
  const [groupName, setGroupName] = useState("Nhóm PIONEER 1-1");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
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


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Sắp xếp dữ liệu
  const sortedPeople = useMemo(() => {
    if (!sortConfig) return people;

    return [...people].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [people, sortConfig]);
  return (
    <div className="min-h-screen px-8 py-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 font-sans text-sm text-gray-700">
      <div className="px-8 py-4">
        <h1 className="text-4xl font-regular mb-4">Bảng tổng kết điểm</h1>
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
      

        <div className="flex items-center gap-3 mb-6 ">
          <span className="text-sm font-medium text-gray-600">Chốt từ</span>
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
          <span className="text-sm font-medium text-gray-600">đến</span>
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
            <select className="bg-white border rounded-md px-3 py-1 text-xs shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-xs text-gray-600">mục/trang</span>
          </div>
          <input className="flex-1 px-4 py-1 border rounded-full shadow-sm text-sm" placeholder="Search..." />
          <button onClick={() => setShowPopupInput(true)} className="bg-blue-400 px-4 py-1 rounded-full text-xs text-white shadow">+ Add</button>
          <button className="bg-white border px-4 py-1 rounded-full text-xs shadow">Export</button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                {['Tên Zalo', 'Điểm', '$$'].map((header, idx) => (
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
              {people.map((person, idx) => (
                <tr
                  onClick={() => setShowPopup(true)}
                  key={idx}
                  className={`transition-colors duration-150 ${person.selected
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'hover:bg-blue-50'
                    }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {person.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {person.lifecycle}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {person.salary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị từ <span className="font-medium">1</span> tới <span className="font-medium">10</span> của <span className="font-medium">100</span> dữ liệu
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              &lt;
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-8 rounded-md text-sm ${page === 1 ? 'bg-blue-400 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
            <span className="w-10 h-8 flex items-center justify-center text-gray-400">...</span>
            {[14, 15, 16].map((page) => (
              <button
                key={page}
                className="w-10 h-8 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
              &gt;
            </button>
          </div>
        </div>
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
            <TransactionHistory />
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
            <InputForm />
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
}
