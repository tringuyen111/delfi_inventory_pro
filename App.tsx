import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/pages/HomePage';
import OrganizationPage from '@/pages/OrganizationPage';
import BranchPage from '@/pages/BranchPage';
import WarehousePage from '@/pages/WarehousePage';
import LocationPage from '@/pages/LocationPage';
import PartnerPage from '@/pages/PartnerPage';
import UomPage from '@/pages/UomPage';
import GoodsTypePage from '@/pages/GoodsTypePage';
import ModelGoodsPage from '@/pages/ModelGoodsPage';
import GoodsReceiptPage from '@/pages/GoodsReceiptPage';
import GoodsIssuePage from '@/pages/GoodsIssuePage';
import GoodsTransferPage from '@/pages/GoodsTransferPage';
import InventoryCountPage from '@/pages/InventoryCountPage';
import RearrangementPage from '@/pages/RearrangementPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-3 sticky top-12">
              <Sidebar />
            </div>
            <div className="md:col-span-9">
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
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
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;