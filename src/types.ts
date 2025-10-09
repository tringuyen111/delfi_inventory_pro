export type Status = 'Active' | 'Inactive';
export type DocStatus = 'Draft' | 'New' | 'Exporting' | 'Completed' | 'Cancelled' | 'Counting' | 'Review';
export type CountType = 'Full' | 'By Location' | 'By Item';

export interface Organization {
  id: string;
  org_code: string;
  org_name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  branch_code: string;
  branch_name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  organization_id: string;
  // This represents the joined data from the 'organizations' table
  organizations: {
    org_name: string;
  } | null;
}

export interface Warehouse {
  id: string;
  wh_code: string;
  wh_name: string;
  address?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  branch_id: string;
  // This represents the joined data from the 'branches' table
  branches: {
    branch_name: string;
  } | null;
}

export interface Location {
  id: string;
  loc_code: string;
  loc_name: string;
  status: Status;
  created_at: string;
  updated_at: string;
  warehouse_id: string;
  // This represents the joined data from the 'warehouses' table
  warehouses: {
    wh_name: string;
  } | null;
}

export interface Partner {
  id: string;
  partner_code: string;
  partner_name: string;
  partner_type: string[];
  address?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface Uom {
  id: string;
  uom_code: string;
  uom_name: string;
  measurement_type: string;
  uom_type: string;
  base_uom_id?: string | null;
  conv_factor?: number | null;
  description?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface GoodsType {
  id: string;
  goods_type_code: string;
  goods_type_name: string;
  description?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
}

// Interface for onhand_inventory table
export interface OnhandInventory {
    id: string;
    warehouse_id: string;
    location_id: string;
    model_goods_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
}

// Interface for goods_receipts table
export interface GoodsReceipt {
    id: string;
    gr_no: string;
    status: DocStatus;
    note?: string | null;
    partner_id?: string | null;
    warehouse_id: string;
    created_at: string;
    updated_at: string;
}

// Interface for goods_receipt_lines table
export interface GoodsReceiptLine {
    id: string;
    goods_receipt_id: string;
    model_goods_id: string;
    quantity_planned: number;
    quantity_received: number;
    created_at: string;
    updated_at: string;
}

// Interface for goods_issues table
export interface GoodsIssue {
    id: string;
    gi_no: string;
    status: DocStatus;
    note?: string | null;
    partner_id?: string | null;
    warehouse_id: string; // source warehouse
    created_at: string;
    updated_at: string;
}

// Interface for goods_issue_lines table
export interface GoodsIssueLine {
    id: string;
    goods_issue_id: string;
    model_goods_id: string;
    quantity_planned: number;
    quantity_picked: number;
    created_at: string;
    updated_at: string;
}

// Interface for goods_transfers table
export interface GoodsTransfer {
    id: string;
    gt_no: string;
    status: DocStatus;
    note?: string | null;
    source_warehouse_id: string;
    destination_warehouse_id: string;
    created_at: string;
    updated_at: string;
}

// Interface for goods_transfer_lines table
export interface GoodsTransferLine {
    id: string;
    goods_transfer_id: string;
    model_goods_id: string;
    quantity_transfer: number;
    created_at: string;
    updated_at: string;
}

// Interface for inventory_counts table
export interface InventoryCount {
    id: string;
    ic_no: string;
    status: DocStatus;
    count_type: CountType;
    note?: string | null;
    warehouse_id: string;
    created_at: string;
    updated_at: string;
}

// Interface for inventory_count_lines table
export interface InventoryCountLine {
    id: string;
    inventory_count_id: string;
    model_goods_id: string;
    location_id: string;
    system_quantity: number;
    counted_quantity?: number | null;
    created_at: string;
    updated_at: string;
}

// Interface for rearrangement_tickets table
export interface RearrangementTicket {
    id: string;
    ticket_no: string;
    status: DocStatus;
    created_by?: string | null;
    note?: string | null;
    warehouse_id: string;
    created_at: string;
    updated_at: string;
}

// Interface for rearrangement_ticket_lines table
export interface RearrangementTicketLine {
    id: string;
    ticket_id: string;
    model_goods_id: string;
    source_location_id: string;
    destination_location_id: string;
    quantity: number;
    created_at: string;
}
