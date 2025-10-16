import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= half + 1) {
      for (let i = 1; i <= maxPagesToShow - 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - half) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();
  
  const baseButtonClasses = "px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
  const activeButtonClasses = "bg-primary-600 text-white border border-primary-600";
  const inactiveButtonClasses = "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600";
  const disabledButtonClasses = "opacity-50 cursor-not-allowed";

  return (
    <nav className="flex items-center justify-between mt-6" aria-label="Pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`${baseButtonClasses} ${inactiveButtonClasses} ${currentPage === 1 ? disabledButtonClasses : ''}`}
      >
        Trước
      </button>

      <div className="hidden sm:flex items-center space-x-2">
        {pages.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`${baseButtonClasses} ${page === currentPage ? activeButtonClasses : inactiveButtonClasses}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
              {page}
            </span>
          )
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${baseButtonClasses} ${inactiveButtonClasses} ${currentPage === totalPages ? disabledButtonClasses : ''}`}
      >
        Sau
      </button>
    </nav>
  );
};

export default Pagination;
