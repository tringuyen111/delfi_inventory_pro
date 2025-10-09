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
    "id": "uom-001", "uom_code": "CAI", "uom_name": "Cái",
    "measurement_type": "Piece", "uom_type": "Base", "status": "Active"
  },
  {
    "id": "uom-002", "uom_code": "THUNG", "uom_name": "Thùng",
    "measurement_type": "Piece", "uom_type": "Base", "status": "Active"
  },
  {
    "id": "uom-003", "uom_code": "KG", "uom_name": "Kilogram",
    "measurement_type": "Weight", "uom_type": "Base", "status": "Active"
  },
  {
    "id": "uom-004", "uom_code": "LOC", "uom_name": "Lốc",
    "measurement_type": "Piece", "uom_type": "Alt", "base_uom": "THUNG",
    "conv_factor": 4, "status": "Active"
  }
]`;

// FIX: Added a map for base UOM UUIDs to resolve foreign key relationships.
// These UUIDs would be obtained after seeding the 'uoms' table with base units.
// For this demonstration, we'll use placeholder UUIDs.
const uomIdMap = {
    "CAI": "93f2f035-f40c-4507-a854-5fc4586aafa6",
    "THUNG": "87905bf6-e3a1-4caf-b92c-7293a5c31d08",
    "KG": "ebd6eb2f-b725-46c2-bee3-32ada14a436d"
};

const DataSeederUoms: React.FC = () => {
    const [copied, setCopied] = useState(false);

    // FIX: Corrected CSV generation to include the 'base_uom_id' column.
    // The previous version omitted this crucial foreign key, which would cause data import to fail.
    const csvOutput = useMemo(() => {
        const jsonData = JSON.parse(jsonInput);
        
        const headers = ["uom_code", "uom_name", "measurement_type", "uom_type", "conv_factor", "status", "base_uom_id"];
        
        const csvRows = jsonData.map((row: any) => {
            const base_uom_id = row.base_uom ? uomIdMap[row.base_uom as keyof typeof uomIdMap] || '' : '';
            const values = [
                row.uom_code,
                row.uom_name,
                row.measurement_type,
                row.uom_type,
                row.conv_factor || '', // Handle potentially missing conv_factor
                row.status,
                base_uom_id,
            ];
            return values.map(value => `"${value ?? ''}"`).join(',');
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
                Tiếp tục Bước 2: Nạp dữ liệu cho Bảng `uoms`
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Input: uoms.json</h3>
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

export default DataSeederUoms;
