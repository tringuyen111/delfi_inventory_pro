import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import OrganizationPage from './pages/OrganizationPage';
import BranchPage from './pages/BranchPage';
import WarehousePage from './pages/WarehousePage';
import LocationPage from './pages/LocationPage';
import PartnerPage from './pages/PartnerPage';
import UomPage from './pages/UomPage';
import GoodsTypePage from './pages/GoodsTypePage';
import ModelGoodsPage from './pages/ModelGoodsPage';
import GoodsReceiptPage from './pages/GoodsReceiptPage';
import GoodsIssuePage from './pages/GoodsIssuePage';
import GoodsTransferPage from './pages/GoodsTransferPage';
import InventoryCountPage from './pages/InventoryCountPage';
import RearrangementPage from './pages/RearrangementPage';

const App: React.FC = () => {
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
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;