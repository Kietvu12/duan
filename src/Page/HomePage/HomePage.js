import React, { useMemo, useState } from 'react';

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
  const [sortConfig, setSortConfig] = useState(null);

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
      <div className="flex items-center justify-between px-6 py-3 bg-transparent">
        <div className="text-2xl font-bold text-black flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
           COMPANY
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-[40px] shadow-sm">
            <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-[40px] transition-all">
              Giao dịch
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-black hover:bg-opacity-10 rounded-[40px] transition-all">
              Tạo mới bản ghi
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-black hover:bg-opacity-10 rounded-[40px] transition-all">
              Quản lý tài khoản
            </button>
          </div>
          <button className="p-2 text-gray-700 hover:bg-black hover:bg-opacity-10 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="p-2 text-gray-700 hover:bg-black hover:bg-opacity-10 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-black font-medium">
            <span>JD</span>
          </div>
        </div>
      </div>

      {/* Page title + filters */}
      <div className="px-8 py-4">
        <h1 className="text-4xl font-regular mb-4">Bảng tổng kết điểm</h1>
        <h2 className="text-2xl font-bold mb-4">Nhóm PIONEER 1-1</h2>
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
          <button className="bg-blue-400 px-4 py-1 rounded-full text-xs text-white shadow">+ Add</button>
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
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${person.status === 'Absent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                      }`}>
                      {person.status}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          {/* Hiển thị thông tin */}
          <div className="text-sm text-gray-600">
            Hiển thị từ <span className="font-medium">1</span> tới <span className="font-medium">10</span> của <span className="font-medium">100</span> dữ liệu
          </div>

          {/* Phân trang */}
          <div className="flex space-x-1">
  {/* Nút lùi */}
  <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
    &lt;
  </button>

  {/* Trang đầu */}
  {[1, 2, 3].map((page) => (
    <button
      key={page}
      className={`w-10 h-8 rounded-md text-sm ${
        page === 1 ? 'bg-blue-400 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {page}
    </button>
  ))}

  {/* Dấu ... */}
  <span className="w-10 h-8 flex items-center justify-center text-gray-400">...</span>

  {/* Trang cuối */}
  {[14, 15, 16].map((page) => (
    <button
      key={page}
      className="w-10 h-8 rounded-md text-sm text-gray-600 hover:bg-gray-100"
    >
      {page}
    </button>
  ))}

  {/* Nút tiến */}
  <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
    &gt;
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
