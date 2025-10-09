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
    "id": "org-001",
    "orgCode": "DELFI",
    "orgName": "Delfi Technologies Vietnam",
    "address": "123 Main Street, Ho Chi Minh City, Vietnam",
    "phone": "0987654321",
    "email": "contact@delfi.com.vn",
    "status": "Active"
  },
  {
    "id": "org-002",
    "orgCode": "FASHIONISTA",
    "orgName": "Fashionista Boutique",
    "address": "456 Fashion Avenue, Hanoi, Vietnam",
    "phone": "0123456789",
    "email": "support@fashionista.vn",
    "status": "Active"
  }
]`;

const DataSeeder: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const csvOutput = useMemo(() => {
        const jsonData = JSON.parse(jsonInput);
        const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        
        const headers = ["org_code", "org_name", "address", "phone", "email", "status"];
        
        const csvRows = jsonData.map((row: any) => {
            const newRow: {[key: string]: any} = {};
            for (const key in row) {
                if (key !== 'id') {
                     newRow[camelToSnakeCase(key)] = row[key];
                }
            }
            return headers.map(header => `"${newRow[header]}"`).join(',');
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
        <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Kết quả Bước 2: Nạp Dữ Liệu Ban Đầu (Data Seeding)
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Input: organizations.json</h3>
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

export default DataSeeder;
