import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, BadgeDollarSign, CheckCircle } from 'lucide-react';

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState({
    avatar: 'https://via.placeholder.com/100',
    name: 'Nguyen Van A',
    role: 'User',
    email: 'nguyenvana@example.com',
    password: '********',
    point: 1200
  });

  const [originalInfo, setOriginalInfo] = useState(userInfo);
  const [updated, setUpdated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field, value) => {
    const newInfo = { ...userInfo, [field]: value };
    setUserInfo(newInfo);
    setUpdated(JSON.stringify(newInfo) !== JSON.stringify(originalInfo));
  };

  const handleUpdate = () => {
    setOriginalInfo(userInfo);
    setUpdated(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 border border-blue-200">
        <div className="flex items-center mb-6">
          <img
            src={userInfo.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mr-6 border-4 border-blue-300"
          />
          <div>
            <p className="text-2xl font-bold text-blue-800">{userInfo.name}</p>
            <p className="text-blue-600">Left point: <span className="font-semibold">{userInfo.point}</span></p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="flex-grow border border-blue-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <BadgeDollarSign className="w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={userInfo.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="flex-grow border border-blue-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="flex-grow border border-blue-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            <input
              type="password"
              value={userInfo.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="flex-grow border border-blue-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {updated && (
          <div className="mt-8 text-center">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 transition"
            >
              Cập nhật thông tin
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="mt-4 flex items-center justify-center text-green-600 font-semibold">
            <CheckCircle className="w-5 h-5 mr-2" /> Đã lưu thành công!
          </div>
        )}
      </div>
  );
};

export default AccountInfo;
