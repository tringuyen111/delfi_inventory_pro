import React, { useState, useMemo } from 'react';
import { Organization } from '../types';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { useSupabaseMutation } from '../hooks/useSupabaseMutation';
import { useToastContext } from '../components/ui/Toast';
import { useDebounce } from '../hooks/useDebounce';
import Pagination from '../components/ui/Pagination';

// Icons
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const AddIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const StatusBadge: React.FC<{ status: 'Active' | 'Inactive' }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  const activeClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  const inactiveClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  return <span className={`${baseClasses} ${status === 'Active' ? activeClasses : inactiveClasses}`}>{status}</span>;
};

const OrganizationPage: React.FC = () => {
  const toast = useToastContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pageSize = 10;

  const { 
    data: organizations, 
    loading, 
    error, 
    refetch,
    totalCount 
  } = useSupabaseQuery<Organization>({
    table: 'organizations',
    select: '*',
    orderBy: { column: 'org_name', ascending: true },
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    filter: {
      term: debouncedSearchTerm,
      columns: ['org_code', 'org_name', 'email'],
    },
  });

  const mutation = useSupabaseMutation();

  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  const handleDelete = async () => {
    if (!deletingOrgId) return;

    try {
      await mutation.remove('organizations', deletingOrgId);
      toast.success('Đã xóa tổ chức thành công');
      await refetch();
      if (organizations.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setDeletingOrgId(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Quản lý Tổ chức
          </h2>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AddIcon className="h-5 w-5" />
              Tạo mới
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-100 p-4 rounded-r-lg" role="alert">
            <p className="font-semibold">Đã xảy ra lỗi</p>
            <p>{error}</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tên</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {organizations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu'}
                      </td>
                    </tr>
                  ) : (
                    organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{org.org_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{org.org_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{org.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={org.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-4">
                            <button disabled className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                              <EditIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => setDeletingOrgId(org.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <DeleteIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={deletingOrgId !== null}
        onClose={() => setDeletingOrgId(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa Tổ chức"
        message="Bạn có chắc chắn muốn xóa tổ chức này không? Hành động này sẽ không thể hoàn tác."
      />
    </>
  );
};

export default OrganizationPage;