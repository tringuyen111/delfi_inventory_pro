import React from 'react';

// Định nghĩa các props mà component sẽ nhận
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

/**
 * Một component modal có thể tái sử dụng để yêu cầu người dùng xác nhận
 * một hành động.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  // Nếu modal không mở, không render gì cả
  if (!isOpen) {
    return null;
  }

  // Xử lý việc nhấn ra ngoài vùng modal để đóng
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Lớp phủ (Overlay)
    // - fixed inset-0: Chiếm toàn bộ màn hình và cố định vị trí
    // - z-50: Đảm bảo nó nằm trên các thành phần khác
    // - bg-black bg-opacity-60 backdrop-blur-sm: Tạo hiệu ứng nền mờ
    // - flex items-center justify-center: Căn giữa nội dung modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Hộp thoại (Modal Content) */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl dark:bg-gray-800 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        {/* Tiêu đề */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        
        {/* Nội dung thông báo */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        
        {/* Khu vực chứa các nút hành động */}
        <div className="mt-6 flex justify-end space-x-4">
          {/* Nút Hủy */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Hủy
          </button>
          
          {/* Nút Xác nhận (hành động nguy hiểm) */}
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Xác nhận
          </button>
        </div>
      </div>
       {/* Thêm keyframes cho animation */}
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
