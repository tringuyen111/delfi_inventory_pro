import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Organization } from '@/types';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

// --- Icons ---
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
// --- End Icons ---


const OrganizationPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State để quản lý modal xác nhận xóa
  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hàm lấy dữ liệu, được bọc trong useCallback để tránh re-render không cần thiết
  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('organizations')
        .select('*')
        .order('org_name', { ascending: true });

      if (fetchError) throw fetchError;
      if (data) setOrganizations(data);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // Hàm mở modal và set ID của tổ chức cần xóa
  const handleOpenDeleteModal = (id: string) => {
    setDeletingOrgId(id);
  };

  // Hàm đóng modal
  const handleCloseDeleteModal = () => {
    setDeletingOrgId(null);
  };

  // Hàm xác nhận và thực hiện xóa
  const handleConfirmDelete = async () => {
    if (!deletingOrgId) return;

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('organizations')
        .delete()
        .eq('id', deletingOrgId);

      if (deleteError) throw deleteError;
      
      // Sau khi xóa thành công, tải lại danh sách
      await fetchOrganizations();

    } catch (err: any) {
      setError(err.message || 'Failed to delete organization.');
    } finally {
      setIsDeleting(false);
      handleCloseDeleteModal();
    }
  };

  const StatusBadge: React.FC<{ status: 'Active' | 'Inactive' }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    const activeClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    const inactiveClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return <span className={`${baseClasses} ${status === 'Active' ? activeClasses : inactiveClasses}`}>{status}</span>;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Quản lý Tổ chức
            </h2>
            <button disabled className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <AddIcon className="h-5 w-5" />
                Tạo mới
            </button>
        </div>
        
        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Đang tải dữ liệu từ Supabase...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-100 p-4 rounded-r-lg" role="alert">
            <p className="font-semibold">Đã xảy ra lỗi</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã Tổ chức</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tên Tổ chức</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {organizations.map((org) => (
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
                          onClick={() => handleOpenDeleteModal(org.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deletingOrgId !== null}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa Tổ chức"
        message="Bạn có chắc chắn muốn xóa tổ chức này không? Hành động này sẽ không thể hoàn tác."
      />
    </>
  );
};

export default OrganizationPage;