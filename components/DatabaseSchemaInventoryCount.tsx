import React, { useState } from 'react';

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
);

const sqlCode = `-- =================================================================
-- Table: inventory_counts
-- Header table for inventory count documents.
-- =================================================================
CREATE TABLE inventory_counts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ic_no text UNIQUE NOT NULL,
    status text NOT NULL,
    count_type text NOT NULL, -- 'Full', 'By Location', 'By Item'
    note text,
    warehouse_id uuid NOT NULL REFERENCES warehouses(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_inventory_counts_updated_at BEFORE UPDATE ON inventory_counts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: inventory_count_lines
-- Line items for each inventory count document.
-- =================================================================
CREATE TABLE inventory_count_lines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    inventory_count_id uuid NOT NULL REFERENCES inventory_counts(id) ON DELETE CASCADE,
    model_goods_id uuid NOT NULL REFERENCES model_goods(id),
    location_id uuid NOT NULL REFERENCES locations(id),
    system_quantity numeric NOT NULL CHECK (system_quantity >= 0),
    counted_quantity numeric CHECK (counted_quantity >= 0), -- Can be null before counting
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_inventory_count_lines_updated_at BEFORE UPDATE ON inventory_count_lines FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
`;

const DatabaseSchemaInventoryCount: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(sqlCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Kết quả Bước 7: Mở rộng Database (Bảng Kiểm Kê Kho)
            </h2>
            <div className="relative bg-gray-900 rounded-lg shadow-lg">
                <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-400">POSTGRESQL SCRIPT</p>
                    <button 
                        onClick={handleCopy} 
                        className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium text-gray-200 transition-colors duration-200"
                        aria-label="Copy SQL code"
                    >
                        {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                        {copied ? 'Đã chép!' : 'Chép SQL'}
                    </button>
                </div>
                <div className="p-4 font-mono text-sm text-gray-300 overflow-x-auto max-h-96">
                    <pre><code>{sqlCode}</code></pre>
                </div>
            </div>
        </div>
    );
};

export default DatabaseSchemaInventoryCount;