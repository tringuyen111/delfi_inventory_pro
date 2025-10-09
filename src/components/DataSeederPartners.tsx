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
    "id": "p-001",
    "partner_code": "SUP-ACME",
    "partner_name": "ACME Corporation",
    "partner_type": ["Supplier"],
    "address": "123 Industrial Rd, USA",
    "status": "Active"
  },
  {
    "id": "p-002",
    "partner_code": "CUS-GLOBEX",
    "partner_name": "Globex Inc.",
    "partner_type": ["Customer"],
    "address": "456 Commerce St, USA",
    "status": "Active"
  },
  {
    "id": "p-003",
    "partner_code": "3PL-SHIPIT",
    "partner_name": "ShipIt Logistics",
    "partner_type": ["3PL", "Supplier"],
    "address": "789 Logistics Blvd, USA",
    "status": "Inactive"
  }
]`;

const DataSeederPartners: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const csvOutput = useMemo(() => {
        const jsonData = JSON.parse(jsonInput);
        
        const headers = ["partner_code", "partner_name", "partner_type", "address", "status"];
        
        const csvRows = jsonData.map((row: any) => {
            const values = [
                row.partner_code,
                row.partner_name,
                JSON.stringify(row.partner_type), // Convert array to a valid JSON string
                row.address,
                row.status,
            ];
            // Enclose each value in double quotes for the CSV file
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
                Tiếp tục Bước 2: Nạp dữ liệu cho Bảng \`partners\`
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Input: partners.json</h3>
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

export default DataSeederPartners;
