import React, { useState } from 'react';
import {
  ArrowRightCircle,
  ArrowLeftCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import dayjs from 'dayjs';

// Nhóm giao dịch theo ngày
const groupByDate = (transactions) => {
  const groups = {};
  transactions.forEach((t) => {
    const date = dayjs(t.date).format('YYYY-MM-DD');
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
  });
  return groups;
};

const TransactionHistory = () => {
  const userName = 'Vũ Kiệt';
  const initialBalance = 1000;

  const transactions = [
    { name: 'John Smith', description: 'money for groceries', amount: '- $23', date: '2024-06-24T14:00:00' },
    { name: 'Amy Rose', description: 'money for gym', amount: '+ $28', date: '2024-06-24T09:30:00' },
    { name: 'Mega Image', description: 'super market', amount: '+ $45', date: '2024-06-23T18:10:00' },
    { name: 'Jeff Peterson', description: 'karate lessons', amount: '- $88', date: '2024-06-23T10:15:00' },
    { name: 'Dana Kinston', description: 'surprise', amount: '+ $100', date: '2024-06-22T11:20:00' },
    { name: 'Bill Jones', description: 'movie', amount: '- $50', date: '2024-06-22T08:00:00' },
    { name: 'Linda Ray', description: 'gift', amount: '+ $75', date: '2024-06-21T17:00:00' },
  ];

  const grouped = groupByDate(transactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => dayjs(b).unix() - dayjs(a).unix());

  // Pagination
  const itemsPerPage = 2;
  const totalPages = Math.ceil(sortedDates.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const pagedDates = sortedDates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  let runningBalance = initialBalance;

  return (
    <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch</h2>
        <p className="text-lg font-medium text-gray-600">{userName}</p>
      </div>

      {/* Giao dịch */}
      {pagedDates.map((date) => {
        const items = grouped[date].sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

        const dayTotalChange = items.reduce((sum, t) => {
          const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, ''));
          return sum + amount;
        }, 0);

        const balanceAfter = runningBalance;
        runningBalance -= dayTotalChange;

        return (
          <div key={date} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Chốt điểm đến {dayjs(items[0].date).format('HH:mm')}, {dayjs(date).format('DD/MM/YYYY')}
              </h3>
              <span className="text-sm text-gray-500">
                Số dư: <strong>${balanceAfter.toFixed(2)}</strong>
              </span>
            </div>

            {/* Dòng giao dịch */}
            {items.map((transaction, index) => {
              const isPositive = transaction.amount.startsWith('+');
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
                      <p className="text-base font-semibold text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className={`text-base font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-gray-400">{dayjs(transaction.date).format('HH:mm')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {/* Nút trước */}
        <button
          className="p-2 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Các số trang */}
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

        {/* Nút sau */}
        <button
          className="p-2 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
