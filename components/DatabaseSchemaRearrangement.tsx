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
-- Table: rearrangement_tickets
-- Header table for internal stock movement/rearrangement tickets.
-- =================================================================
CREATE TABLE rearrangement_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_no text UNIQUE NOT NULL,
    status text NOT NULL,
    created_by text,
    note text,
    warehouse_id uuid NOT NULL REFERENCES warehouses(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_rearrangement_tickets_updated_at BEFORE UPDATE ON rearrangement_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: rearrangement_ticket_lines
-- Line items for each rearrangement ticket.
-- =================================================================
CREATE TABLE rearrangement_ticket_lines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id uuid NOT NULL REFERENCES rearrangement_tickets(id) ON DELETE CASCADE,
    model_goods_id uuid NOT NULL REFERENCES model_goods(id),
    source_location_id uuid NOT NULL REFERENCES locations(id),
    destination_location_id uuid NOT NULL REFERENCES locations(id),
    quantity numeric NOT NULL CHECK (quantity > 0),
    created_at timestamptz DEFAULT now()
);
`;

const DatabaseSchemaRearrangement: React.FC = () => {
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
                Kết quả Bước 9: Mở rộng Database (Bảng Sắp Xếp Kho)
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

export default DatabaseSchemaRearrangement;
