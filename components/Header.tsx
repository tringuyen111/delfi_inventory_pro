
import React from 'react';

const BoxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.0006 18.26L4.94715 14.7346L4.94653 9.26461L12.0006 5.73931L19.0546 9.26461L19.054 14.7346L12.0006 18.26ZM12.0006 20L3.52215 15.7654V8.23461L12.0006 4L20.4791 8.23461V15.7654L12.0006 20ZM10.8654 11.8346L13.1327 13.0654L17.5146 10.7354L15.2473 9.50461L10.8654 11.8346ZM11.1327 15.2646L6.48653 12.7346L8.75385 11.5039L13.3994 14.0339L11.1327 15.2646Z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <div className="text-center border-b border-gray-200 dark:border-gray-600 pb-6">
      <div className="flex items-center justify-center gap-3">
        <BoxIcon className="w-10 h-10 text-primary-500" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Delfi Inventory Pro
        </h1>
      </div>
      <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
        Inventory Management System
      </p>
    </div>
  );
};

export default Header;
