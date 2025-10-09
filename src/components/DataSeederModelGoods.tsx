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


// FIX: Corrected uom_code from "PCS" to "CAI" to align with the uoms.json data.
// This prevents foreign key reference errors during data import.
const jsonInput = `[
  {
    "id": "mg-001",
    "model_code": "IPHONE15",
    "model_name": "iPhone 15 Pro Max",
    "goods_type_code": "FG",
    "base_uom": "CAI",
    "tracking_type": "Serial",
    "status": "Active"
  },
  {
    "id": "mg-002",
    "model_code": "COCACOLA",
    "model_name": "Coca-Cola Classic",
    "goods_type_code": "FG",
    "base_uom": "THUNG",
    "tracking_type": "Lot",
    "status": "Active"
  },
  {
    "id": "mg-003",
    "model_code": "SCREW-M5",
    "model_name": "M5 Screw",
    "goods_type_code": "RM",
    "base_uom": "KG",
    "tracking_type": "None",
    "status": "Inactive"
  }
]`;

const goodsTypeIdMap = {
    "FG": "52a18f2f-8553-433b-9366-0783301a2f44",
    "RM": "eb000673-1f19-482a-92e1-7e8c07e0545f",
    "PKG": "82422a59-7157-41a4-9988-59c44654b423"
};

// FIX: Updated the key from "PCS" to "CAI" to match the corrected jsonInput and uoms.json.
const uomIdMap = {
    "CAI": "93f2f035-f40c-4507-a854-5fc4586aafa6",
    "THUNG": "87905bf6-e3a1-4caf-b92c-7293a5c31d08",
    "KG": "ebd6eb2f-b725-46c2-bee3-32ada14a436d"
};

const DataSeederModelGoods: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const csvOutput = useMemo(() => {
        const jsonData = JSON.parse(jsonInput);
        
        const headers = ["model_code", "model_name", "tracking_type", "status", "goods_type_id", "base_uom_id"];
        
        const csvRows = jsonData.map((row: any) => {
            const goods_type_id = goodsTypeIdMap[row.goods_type_code as keyof typeof goodsTypeIdMap] || '';
            const base_uom_id = uomIdMap[row.base_uom as keyof typeof uomIdMap] || '';
            const values = [
                row.model_code,
                row.model_name,
                row.tracking_type,
                row.status,
                goods_type_id,
                base_uom_id,
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
                Hoàn tất Bước 2: Nạp dữ liệu cho Bảng `model_goods` (Đã xác thực)
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Input: model_goods.json</h3>
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

export default DataSeederModelGoods;
