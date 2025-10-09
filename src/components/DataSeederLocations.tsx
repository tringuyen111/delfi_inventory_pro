import React, { useState, useMemo } from 'react';

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

const CodeBlock: React.FC<{ title: string; language: string; code: string; onCopy?: () => void; copyLabel?: string; copiedLabel?: string; isCopied?: boolean; }> = 
({ title, language, code, onCopy, copyLabel = 'Copy', copiedLabel = 'Copied!', isCopied = false }) => (
    <div className="relative bg-gray-900 rounded-lg shadow-lg w-full">
        <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
            <p className="text-xs font-semibold text-gray-400">{language}</p>
            {onCopy && (
                <button 
                    onClick={onCopy} 
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium text-gray-200 transition-colors duration-200"
                    aria-label={copyLabel}
                >
                    {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                    {isCopied ? copiedLabel : copyLabel}
                </button>
            )}
        </div>
        <div className="p-4 font-mono text-sm text-gray-300 overflow-x-auto max-h-72">
            <pre><code>{code}</code></pre>
        </div>
    </div>
);


const jsonInput = `[
  {
    "id": "loc-001",
    "loc_code": "A1-01-01",
    "loc_name": "Aisle 1, Rack 1, Shelf 1",
    "wh_code": "NYC-CEN",
    "status": "Active"
  },
  {
    "id": "loc-002",
    "loc_code": "A1-01-02",
    "loc_name": "Aisle 1, Rack 1, Shelf 2",
    "wh_code": "NYC-CEN",
    "status": "Active"
  },
  {
    "id": "loc-003",
    "loc_code": "RCV-01",
    "loc_name": "Receiving Dock 1",
    "wh_code": "LDN-SUB",
    "status": "Active"
  }
]`;

// These UUIDs would be obtained after seeding the 'warehouses' table.
// For this demonstration, we'll use placeholder UUIDs.
const warehouseIdMap = {
    "NYC-CEN": "8d87784b-0133-4131-a20c-3a9584b15678",
    "LDN-SUB": "36d2c16a-3670-431e-8280-77a8d5c432b1",
    "MIA-MAIN": "e9e4e4e9-1e1e-4e1e-8e1e-1e1e1e1e1e1e"
};

const DataSeederLocations: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const csvOutput = useMemo(() => {
        const jsonData = JSON.parse(jsonInput);
        
        const headers = ["loc_code", "loc_name", "status", "warehouse_id"];
        
        const csvRows = jsonData.map((row: any) => {
            const warehouse_id = warehouseIdMap[row.wh_code as keyof typeof warehouseIdMap] || '';
            const values = [
                row.loc_code,
                row.loc_name,
                row.status,
                warehouse_id
            ];
            return values.map(value => `"${value}"`).join(',');
        });

        const headerRow = headers.map(h => `"${h}"`).join(',');
        return [headerRow, ...csvRows].join('\n');
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(csvOutput).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-200 dark:border-gray-600">
             <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Tiếp tục Bước 2: Nạp dữ liệu cho Bảng `locations`
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Input: locations.json</h3>
                    <CodeBlock title="Input JSON" language="JSON" code={jsonInput} />
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Output: CSV for Import</h3>
                    <CodeBlock 
                        title="Output CSV" 
                        language="CSV" 
                        code={csvOutput}
                        onCopy={handleCopy}
                        copyLabel="Chép CSV"
                        copiedLabel="Đã chép!"
                        isCopied={copied}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataSeederLocations;
