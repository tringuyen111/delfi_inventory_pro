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

const CodeBlock: React.FC<{ language: string; code: string; onCopy?: () => void; copyLabel?: string; copiedLabel?: string; isCopied?: boolean; }> = 
({ language, code, onCopy, copyLabel = 'Copy', copiedLabel = 'Copied!', isCopied = false }) => (
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


const supabaseClientCode = `import { createClient } from '@supabase/supabase-js';

// --- GIẢI PHÁP CHO LỖI RUNTIME ---
// Trong môi trường này, việc đọc biến môi trường từ .env.local không hoạt động,
// gây ra lỗi. Vì vậy, chúng ta sẽ định nghĩa trực tiếp URL và Key ở đây để 
// ứng dụng có thể chạy.
//
// LƯU Ý BẢO MẬT: Trong một dự án production thực tế, bạn không nên gán cứng 
// key như thế này. Hãy luôn sử dụng biến môi trường.

const supabaseUrl = "https://lkubvwreysaclioxxelb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdWJ2d3JleXNhY2xpb3h4ZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NTU0MTksImV4cCI6MjA3NTUzMTQxOX0.9sGcLGe9aTn1B9Aegi2OdbrmeDI1Ruun9clEVYTlzow";

// Khởi tạo và export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;


const FrontendConnection: React.FC = () => {
    const [copiedClient, setCopiedClient] = useState(false);

    const handleCopy = (text: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        navigator.clipboard.writeText(text).then(() => {
            setter(true);
            setTimeout(() => setter(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Bước 3 Đã sửa lỗi: Kết nối Frontend
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
                Đã xảy ra lỗi runtime khi đọc biến môi trường. Dưới đây là phiên bản đã sửa lỗi của file cấu hình, sử dụng trực tiếp thông tin kết nối của bạn.
            </p>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Code đã sửa cho file \`utils/supabaseClient.ts\`</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Sao chép và thay thế toàn bộ nội dung file <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">utils/supabaseClient.ts</code> bằng đoạn mã dưới đây.
                    </p>
                    <CodeBlock 
                        language="TYPESCRIPT" 
                        code={supabaseClientCode}
                        onCopy={() => handleCopy(supabaseClientCode, setCopiedClient)}
                        copyLabel="Chép Code"
                        copiedLabel="Đã chép!"
                        isCopied={copiedClient}
                    />
                </div>
            </div>
        </div>
    );
};

export default FrontendConnection;
