import React from 'react';

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
    </svg>
);


interface PlanStepProps {
  step: number;
  title: string;
  description: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
}

const PlanStep: React.FC<PlanStepProps> = ({ step, title, description, isCurrent = false, isCompleted = false }) => {
    const getStepClasses = () => {
        if (isCurrent) return 'bg-primary-500 text-white ring-4 ring-primary-200 dark:ring-primary-900';
        if (isCompleted) return 'bg-green-500 text-white';
        return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    };

    return (
        <div className="flex items-start space-x-4">
            <div className={`flex items-center justify-center rounded-full w-10 h-10 ${getStepClasses()} font-bold text-lg flex-shrink-0`}>
                {isCompleted ? <CheckCircleIcon className="w-6 h-6"/> : step}
            </div>
            <div>
                <h3 className={`font-semibold text-lg ${isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200'}`}>{title}</h3>
                <p className={`text-gray-600 dark:text-gray-400 ${isCompleted ? 'line-through' : ''}`}>{description}</p>
            </div>
        </div>
    );
};


const ActionPlan: React.FC = () => {
    const steps = [
        {
            step: 1,
            title: "Thiết kế Database (Master Data)",
            description: "Tạo mã SQL để dựng cấu trúc cho các bảng dữ liệu gốc.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 2,
            title: "Nạp Dữ Liệu Ban Đầu",
            description: "Xây dựng công cụ để chuyển dữ liệu từ các file JSON cũ vào database mới.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 3,
            title: "Kết Nối Frontend (Master Data)",
            description: "Sửa đổi code React để hiển thị dữ liệu Master Data từ API của Supabase.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 4,
            title: "Mở rộng Backend (Nhập Kho)",
            description: "Tạo các bảng giao dịch cần thiết như `onhand_inventory` và `goods_receipts` để quản lý tồn kho và quy trình nhập hàng.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 5,
            title: "Mở rộng Backend (Xuất Kho)",
            description: "Tạo các bảng giao dịch `goods_issues` và `goods_issue_lines` để hỗ trợ quy trình xuất hàng.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 6,
            title: "Mở rộng Backend (Chuyển Kho)",
            description: "Tạo các bảng giao dịch `goods_transfers` và `goods_transfer_lines` để hỗ trợ quy trình chuyển kho.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 7,
            title: "Mở rộng Backend (Kiểm Kê Kho)",
            description: "Tạo các bảng giao dịch `inventory_counts` và `inventory_count_lines` cho quy trình kiểm kê.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 8,
            title: "Kết Nối Frontend (Nghiệp vụ)",
            description: "Hoàn tất kết nối các màn hình Nhập, Xuất, Chuyển, và Kiểm Kê Kho với backend.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 9,
            title: "Mở rộng Backend (Sắp Xếp Kho)",
            description: "Tạo các bảng giao dịch `rearrangement_tickets` cho quy trình di chuyển hàng hóa nội bộ kho.",
            isCurrent: false,
            isCompleted: true,
        },
        {
            step: 10,
            title: "Kết Nối Frontend (Sắp Xếp Kho)",
            description: "Hoàn tất kết nối màn hình Sắp Xếp Kho với backend.",
            isCurrent: true,
            isCompleted: false,
        }
    ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center">Action Plan</h2>
      <div className="space-y-6 border-t border-gray-200 dark:border-gray-600 pt-6">
        {steps.map(step => (
            <PlanStep key={step.step} {...step} />
        ))}
      </div>
    </div>
  );
};

export default ActionPlan;
