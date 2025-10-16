import React from 'react';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <Header />
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Chào mừng đến với Inventory XCloud
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Chọn một mục từ thanh điều hướng bên trái để bắt đầu quản lý kho của bạn.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
