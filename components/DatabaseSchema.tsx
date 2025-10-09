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

const sqlCode = `-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- Helper function to automatically update 'updated_at' timestamps
-- =================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- =================================================================
-- Table: organizations
-- =================================================================
CREATE TABLE organizations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_code text UNIQUE NOT NULL,
    org_name text NOT NULL,
    address text,
    phone text,
    email text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: branches
-- =================================================================
CREATE TABLE branches (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_code text UNIQUE NOT NULL,
    branch_name text NOT NULL,
    organization_id uuid NOT NULL REFERENCES organizations(id),
    address text,
    phone text,
    email text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: warehouses
-- =================================================================
CREATE TABLE warehouses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    wh_code text UNIQUE NOT NULL,
    wh_name text NOT NULL,
    branch_id uuid NOT NULL REFERENCES branches(id),
    address text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: locations
-- =================================================================
CREATE TABLE locations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    loc_code text UNIQUE NOT NULL,
    loc_name text NOT NULL,
    warehouse_id uuid NOT NULL REFERENCES warehouses(id),
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: partners
-- =================================================================
CREATE TABLE partners (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_code text UNIQUE NOT NULL,
    partner_name text NOT NULL,
    partner_type jsonb,
    address text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: goods_types
-- =================================================================
CREATE TABLE goods_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    goods_type_code text UNIQUE NOT NULL,
    goods_type_name text NOT NULL,
    description text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_goods_types_updated_at BEFORE UPDATE ON goods_types FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: uoms (Units of Measure)
-- =================================================================
CREATE TABLE uoms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    uom_code text UNIQUE NOT NULL,
    uom_name text NOT NULL,
    measurement_type text NOT NULL,
    uom_type text NOT NULL,
    base_uom_id uuid REFERENCES uoms(id),
    conv_factor numeric,
    description text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_uoms_updated_at BEFORE UPDATE ON uoms FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- =================================================================
-- Table: model_goods
-- =================================================================
CREATE TABLE model_goods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    model_code text UNIQUE NOT NULL,
    model_name text NOT NULL,
    goods_type_id uuid NOT NULL REFERENCES goods_types(id),
    base_uom_id uuid NOT NULL REFERENCES uoms(id),
    tracking_type text NOT NULL,
    description text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER update_model_goods_updated_at BEFORE UPDATE ON model_goods FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
`;

const DatabaseSchema: React.FC = () => {
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
                Kết quả Bước 1: PostgreSQL Database Schema
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

export default DatabaseSchema;
