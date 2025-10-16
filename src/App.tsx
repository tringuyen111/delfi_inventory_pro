import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const OrganizationPage = React.lazy(() => import('./pages/OrganizationPage'));
const BranchPage = React.lazy(() => import('./pages/BranchPage'));
const WarehousePage = React.lazy(() => import('./pages/WarehousePage'));
const LocationPage = React.lazy(() => import('./pages/LocationPage'));
const PartnerPage = React.lazy(() => import('./pages/PartnerPage'));
const UomPage = React.lazy(() => import('./pages/UomPage'));
const GoodsTypePage = React.lazy(() => import('./pages/GoodsTypePage'));
const ModelGoodsPage = React.lazy(() => import('./pages/ModelGoodsPage'));
const GoodsReceiptPage = React.lazy(() => import('./pages/GoodsReceiptPage'));
const GoodsIssuePage = React.lazy(() => import('./pages/GoodsIssuePage'));
const GoodsTransferPage = React.lazy(() => import('./pages/GoodsTransferPage'));
const InventoryCountPage = React.lazy(() => import('./pages/InventoryCountPage'));
const RearrangementPage = React.lazy(() => import('./pages/RearrangementPage'));


const App: React.FC = () => {
  const suspenseFallback = (
    <div className="flex items-center justify-center w-full h-full">
        <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Loading Page...</p>
        </div>
    </div>
  );

  return (
    <HashRouter>
      {/* 
        Layout chính của ứng dụng.
        - Sử dụng Grid để chia cột, đáp ứng trên nhiều kích thước màn hình.
        - Trên màn hình nhỏ (mobile), hiển thị 1 cột duy nhất.
        - Trên màn hình vừa (md) trở lên, chia thành 5 cột (1 cho sidebar, 4 cho nội dung).
        - h-screen: Đảm bảo layout chiếm toàn bộ chiều cao màn hình.
      */}
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen bg-gray-100 dark:bg-gray-900">
        
        {/* Cột Sidebar (chiếm 1/5 chiều rộng trên màn hình md trở lên) */}
        <aside className="md:col-span-1 p-4">
          <Sidebar />
        </aside>

        {/* Cột Nội dung chính (chiếm 4/5 chiều rộng trên màn hình md trở lên) */}
        {/* overflow-y-auto: Cho phép cột này cuộn độc lập khi nội dung dài hơn chiều cao màn hình */}
        <main className="col-span-1 md:col-span-4 overflow-y-auto p-4 md:p-8">
          {/* Container dạng "card" cho nội dung trang, giữ lại phong cách thiết kế ban đầu */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full min-h-full">
            <ErrorBoundary>
              <Suspense fallback={suspenseFallback}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/organizations" element={<OrganizationPage />} />
                  <Route path="/branches" element={<BranchPage />} />
                  <Route path="/warehouses" element={<WarehousePage />} />
                  <Route path="/locations" element={<LocationPage />} />
                  <Route path="/partners" element={<PartnerPage />} />
                  <Route path="/uoms" element={<UomPage />} />
                  <Route path="/goods-types" element={<GoodsTypePage />} />
                  <Route path="/model-goods" element={<ModelGoodsPage />} />
                  <Route path="/goods-receipts" element={<GoodsReceiptPage />} />
                  <Route path="/goods-issues" element={<GoodsIssuePage />} />
                  <Route path="/goods-transfers" element={<GoodsTransferPage />} />
                  <Route path="/inventory-counts" element={<InventoryCountPage />} />
                  <Route path="/rearrangement" element={<RearrangementPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
