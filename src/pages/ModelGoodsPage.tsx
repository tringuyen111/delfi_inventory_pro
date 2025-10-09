import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

const ModelGoodsPage: React.FC = () => {
  const [modelGoods, setModelGoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelGoods = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('model_goods')
          .select('*, goods_types ( goods_type_name ), uoms ( uom_name )')
          .order('model_code', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          // Làm phẳng dữ liệu để dễ truy cập trong JSX
          const flattenedData = data.map(item => ({
            ...item,
            goods_type_name: item.goods_types?.goods_type_name ?? 'N/A',
            uom_name: item.uoms?.uom_name ?? 'N/A',
          }));
          setModelGoods(flattenedData);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchModelGoods();
  }, []);

  const StatusBadge: React.FC<{ status: 'Active' | 'Inactive' }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    const activeClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    const inactiveClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return <span className={`${baseClasses} ${status === 'Active' ? activeClasses : inactiveClasses}`}>{status}</span>;
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-6">
        Live Data: Danh sách Mã Hàng
      </h2>
      
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="obj 0 24 24">
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loại Hàng</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ĐV Tính</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tracking</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {modelGoods.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.model_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.model_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.goods_type_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.uom_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.tracking_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ModelGoodsPage;
