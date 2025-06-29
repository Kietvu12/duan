import React, { useState, useEffect } from 'react';
import {
  ArrowRightCircle,
  ArrowLeftCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useProject } from '../Context/ProjectContext';

const groupByDate = (transactions) => {
  const groups = {};
  transactions.forEach((t) => {
    const date = dayjs(t.transaction_date).format('YYYY-MM-DD');
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
  });
  return groups;
};

const TransactionHistory = ({ groupId, userId }) => {
  const { getTransactionsByUser, getUserById, getAllUsers } = useProject();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, transactionsData, usersData] = await Promise.all([
          getUserById(userId),
          getTransactionsByUser(userId),
          getAllUsers()
        ]);
        
        // Lọc giao dịch theo groupId
        const filtered = transactionsData.filter(t => t.group_id === groupId);
        
        setUser(userData);
        setAllUsers(usersData);
        setTransactions(transactionsData);
        setFilteredTransactions(filtered);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu giao dịch');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, userId, getTransactionsByUser, getUserById, getAllUsers]);

  // Hàm lấy tên người dùng từ related_user_id
  const getRelatedUserName = (relatedUserId) => {
    if (!relatedUserId) return null;
    const relatedUser = allUsers.find(u => u.user_id === relatedUserId);
    return relatedUser?.zalo_name || `User ${relatedUserId}`;
  };

  const grouped = groupByDate(filteredTransactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => dayjs(b).unix() - dayjs(a).unix());
  const totalPages = Math.ceil(sortedDates.length / itemsPerPage);
  const pagedDates = sortedDates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="text-center py-8">Đang tải lịch sử giao dịch...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!filteredTransactions.length) return <div className="text-center py-8">Không có giao dịch nào trong nhóm này</div>;

  // Tính toán số dư ban đầu
  const initialBalance = user ? parseFloat(user.balance) + user.points : 0;
  let runningBalance = initialBalance;

  return (
    <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch</h2>
        {user && (
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium text-gray-600">
              {user.zalo_name || `User ${userId}`}
            </p>
          </div>
        )}
      </div>

      {/* Giao dịch */}
      {pagedDates.map((date) => {
        const items = grouped[date].sort((a, b) => 
          dayjs(b.transaction_date).unix() - dayjs(a.transaction_date).unix()
        );

        const dayTotalChange = items.reduce((sum, t) => sum + t.points_change, 0);
        const balanceAfter = runningBalance;
        runningBalance -= dayTotalChange;

        return (
          <div key={date} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {dayjs(date).format('DD/MM/YYYY')}
              </h3>
              <span className="text-sm text-gray-500">
                Số dư: <strong>{balanceAfter.toLocaleString('vi-VN')}đ</strong>
              </span>
            </div>

            {items.map((transaction, index) => {
              const isPositive = transaction.points_change > 0;
              const amountText = `${isPositive ? '+' : ''}${transaction.points_change} điểm`;
              const transactionTypeMap = {
                'nhan_san': 'Nhận sân',
                'giao_lich': 'Giao lịch',
                'san_cho': 'Sân cho',
                'nhan_lich': 'Nhận lịch'
              };

              const relatedUserName = getRelatedUserName(transaction.related_user_id);
              const transactionContent = relatedUserName 
                ? `${transaction.content} (${relatedUserName})`
                : transaction.content;

              return (
                <div
                  key={index}
                  className="mb-2 transition-colors duration-150 hover:bg-blue-100 bg-blue-50 flex justify-between items-center gap-x-20 px-4 py-4 border-b last:border-none rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-5 flex-grow">
                    <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isPositive ? (
                        <ArrowRightCircle className="text-green-500 w-6 h-6" />
                      ) : (
                        <ArrowLeftCircle className="text-red-500 w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {transactionTypeMap[transaction.transaction_type] || transaction.transaction_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transactionContent}
                      </p>
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className={`text-base font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {amountText}
                    </p>
                    <p className="text-sm text-gray-400">
                      {dayjs(transaction.transaction_date).format('HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.amount}đ
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="p-2 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            className="p-2 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;