import React, { useState } from 'react';
import { Search } from 'lucide-react';

const InputForm = () => {
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    type: 'Nhận san',
    name: '',
    location: '',
    amount: ''
  });

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
    </div>
  );
};

export default InputForm;
