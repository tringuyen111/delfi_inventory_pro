import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { DocStatus } from '@/types';

const GoodsReceiptPage: React.FC = () => {
  const [goodsReceipts, setGoodsReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoodsReceipts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('goods_receipts')
          .select('*, partners ( partner_name ), warehouses ( wh_name )')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Làm phẳng dữ liệu để dễ dàng render
          const flattenedData = data.map(gr => ({
            ...gr,
            partner_name: gr.partners?.partner_name ?? 'N/A',
            wh_name: gr.warehouses?.wh_name ?? 'N/A',
          }));
          setGoodsReceipts(flattenedData);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoodsReceipts();
  }, []);

  const StatusBadge: React.FC<{ status: DocStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full capitalize';
    let statusClasses = '';
    switch (status) {
      case 'Draft':
        statusClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        break;
      case 'New':
        statusClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        break;
      case 'Completed':
        statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        break;
      case 'Cancelled':
        statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        break;
      default:
        statusClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
  };

  const NoData = () => (
    <tr>
      <td colSpan={5} className="text-center py-10">
        <div className="text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Chưa có phiếu nhập kho nào được tạo.</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-6">
        Nghiệp vụ: Danh sách Phiếu Nhập Kho
      </h2>
      
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2">Loading data from Supabase...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-100 p-4 rounded-r-lg" role="alert">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mã Phiếu (GRN)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nhà cung cấp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kho</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày tạo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {goodsReceipts.length > 0 ? goodsReceipts.map((gr) => (
                <tr key={gr.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">{gr.gr_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{gr.partner_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{gr.wh_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(gr.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={gr.status} />
                  </td>
                </tr>
              )) : <NoData />}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GoodsReceiptPage;
