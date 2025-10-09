
import React from 'react';

const ProjectConfirmation: React.FC = () => {
  return (
    <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 text-primary-800 dark:text-primary-100 p-4 rounded-r-lg" role="alert">
      <p className="font-semibold text-lg">Project Scope Confirmed</p>
      <p className="mt-1">
        Tôi đã hiểu. Sẵn sàng cho Bước 1: Thiết kế Database.
      </p>
    </div>
  );
};

export default ProjectConfirmation;
