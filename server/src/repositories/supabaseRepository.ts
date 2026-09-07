import {
  DonationRepository,
  DonationTypeRepository,
  ExpenseRepository,
  ReceiptRepository,
  UserRepository,
  AuditRepository,
  SettingsRepository,
} from './interfaces';
import {
  Donation,
  DonationType,
  Expense,
  Receipt,
  User,
  AuditLog,
  Settings,
} from '../models/types';
import { getSupabaseClient } from '../config/supabase';

// Helper mappers
function mapDonationFromRow(row: any): Donation {
  return {
    id: row.id,
    year: row.year,
    donorName: row.donor_name,
    mobileNumber: row.mobile_number || undefined,
    email: row.email || undefined,
    address: row.address || undefined,
    donationTypeId: row.donation_type_id,
    donationTypeName: row.donation_type_name,
    amount: Number(row.amount),
    paymentMode: row.payment_mode,
    transactionRef: row.transaction_ref || undefined,
    donationDate: row.donation_date,
    notes: row.notes || undefined,
    status: row.status,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: row.created_at,
    confirmedBy: row.confirmed_by || undefined,
    confirmedByName: row.confirmed_by_name || undefined,
    confirmedAt: row.confirmed_at || undefined,
    rejectionReason: row.rejection_reason || undefined,
    receiptNo: row.receipt_no || undefined,
  };
}

function mapDonationToRow(d: Donation | Partial<Donation>): Record<string, any> {
  const row: Record<string, any> = {};
  if (d.id !== undefined) row.id = d.id;
  if (d.year !== undefined) row.year = d.year;
  if (d.donorName !== undefined) row.donor_name = d.donorName;
  if (d.mobileNumber !== undefined) row.mobile_number = d.mobileNumber;
  if (d.email !== undefined) row.email = d.email;
  if (d.address !== undefined) row.address = d.address;
  if (d.donationTypeId !== undefined) row.donation_type_id = d.donationTypeId;
  if (d.donationTypeName !== undefined) row.donation_type_name = d.donationTypeName;
  if (d.amount !== undefined) row.amount = d.amount;
  if (d.paymentMode !== undefined) row.payment_mode = d.paymentMode;
  if (d.transactionRef !== undefined) row.transaction_ref = d.transactionRef;
  if (d.donationDate !== undefined) row.donation_date = d.donationDate;
  if (d.notes !== undefined) row.notes = d.notes;
  if (d.status !== undefined) row.status = d.status;
  if (d.createdBy !== undefined) row.created_by = d.createdBy;
  if (d.createdByName !== undefined) row.created_by_name = d.createdByName;
  if (d.createdAt !== undefined) row.created_at = d.createdAt;
  if (d.confirmedBy !== undefined) row.confirmed_by = d.confirmedBy;
  if (d.confirmedByName !== undefined) row.confirmed_by_name = d.confirmedByName;
  if (d.confirmedAt !== undefined) row.confirmed_at = d.confirmedAt;
  if (d.rejectionReason !== undefined) row.rejection_reason = d.rejectionReason;
  if (d.receiptNo !== undefined) row.receipt_no = d.receiptNo;
  return row;
}

function mapDonationTypeFromRow(row: any): DonationType {
  return {
    id: row.id,
    year: row.year,
    name: row.name,
    description: row.description || undefined,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    approvedBy: row.approved_by || undefined,
    approvedAt: row.approved_at || undefined,
    rejectionReason: row.rejection_reason || undefined,
  };
}

function mapDonationTypeToRow(t: DonationType | Partial<DonationType>): Record<string, any> {
  const row: Record<string, any> = {};
  if (t.id !== undefined) row.id = t.id;
  if (t.year !== undefined) row.year = t.year;
  if (t.name !== undefined) row.name = t.name;
  if (t.description !== undefined) row.description = t.description;
  if (t.status !== undefined) row.status = t.status;
  if (t.createdBy !== undefined) row.created_by = t.createdBy;
  if (t.createdAt !== undefined) row.created_at = t.createdAt;
  if (t.approvedBy !== undefined) row.approved_by = t.approvedBy;
  if (t.approvedAt !== undefined) row.approved_at = t.approvedAt;
  if (t.rejectionReason !== undefined) row.rejection_reason = t.rejectionReason;
  return row;
}

function mapExpenseFromRow(row: any): Expense {
  return {
    id: row.id,
    year: row.year,
    date: row.date,
    category: row.category,
    description: row.description,
    amount: Number(row.amount),
    paymentMode: row.payment_mode,
    reference: row.reference || undefined,
    attachment: row.attachment || undefined,
    notes: row.notes || undefined,
    status: row.status,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: row.created_at,
    confirmedBy: row.confirmed_by || undefined,
    confirmedByName: row.confirmed_by_name || undefined,
    confirmedAt: row.confirmed_at || undefined,
    rejectionReason: row.rejection_reason || undefined,
  };
}

function mapExpenseToRow(e: Expense | Partial<Expense>): Record<string, any> {
  const row: Record<string, any> = {};
  if (e.id !== undefined) row.id = e.id;
  if (e.year !== undefined) row.year = e.year;
  if (e.date !== undefined) row.date = e.date;
  if (e.category !== undefined) row.category = e.category;
  if (e.description !== undefined) row.description = e.description;
  if (e.amount !== undefined) row.amount = e.amount;
  if (e.paymentMode !== undefined) row.payment_mode = e.paymentMode;
  if (e.reference !== undefined) row.reference = e.reference;
  if (e.attachment !== undefined) row.attachment = e.attachment;
  if (e.notes !== undefined) row.notes = e.notes;
  if (e.status !== undefined) row.status = e.status;
  if (e.createdBy !== undefined) row.created_by = e.createdBy;
  if (e.createdByName !== undefined) row.created_by_name = e.createdByName;
  if (e.createdAt !== undefined) row.created_at = e.createdAt;
  if (e.confirmedBy !== undefined) row.confirmed_by = e.confirmedBy;
  if (e.confirmedByName !== undefined) row.confirmed_by_name = e.confirmedByName;
  if (e.confirmedAt !== undefined) row.confirmed_at = e.confirmedAt;
  if (e.rejectionReason !== undefined) row.rejection_reason = e.rejectionReason;
  return row;
}

function mapReceiptFromRow(row: any): Receipt {
  return {
    receiptNo: row.receipt_no,
    donationId: row.donation_id,
    year: row.year,
    generatedAt: row.generated_at,
    fileName: row.file_name,
    generatedBy: row.generated_by,
  };
}

function mapReceiptToRow(r: Receipt): Record<string, any> {
  return {
    receipt_no: r.receiptNo,
    donation_id: r.donationId,
    year: r.year,
    generated_at: r.generatedAt,
    file_name: r.fileName,
    generated_by: r.generatedBy,
  };
}

function mapUserFromRow(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    status: row.status,
    mobile: row.mobile || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserToRow(u: User | Partial<User>, year?: number): Record<string, any> {
  const row: Record<string, any> = {};
  if (u.id !== undefined) row.id = u.id;
  if (year !== undefined) row.year = year;
  if (u.name !== undefined) row.name = u.name;
  if (u.email !== undefined) row.email = u.email;
  if (u.passwordHash !== undefined) row.password_hash = u.passwordHash;
  if (u.role !== undefined) row.role = u.role;
  if (u.status !== undefined) row.status = u.status;
  if (u.mobile !== undefined) row.mobile = u.mobile;
  if (u.createdAt !== undefined) row.created_at = u.createdAt;
  if (u.updatedAt !== undefined) row.updated_at = u.updatedAt;
  return row;
}

function mapAuditLogFromRow(row: any): AuditLog {
  return {
    id: row.id,
    year: row.year,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    performedBy: row.performed_by,
    performedByName: row.performed_by_name || undefined,
    timestamp: row.timestamp,
    oldValue: row.old_value || undefined,
    newValue: row.new_value || undefined,
  };
}

function mapAuditLogToRow(l: AuditLog): Record<string, any> {
  return {
    id: l.id,
    year: l.year,
    action: l.action,
    entity_type: l.entityType,
    entity_id: l.entityId,
    performed_by: l.performedBy,
    performed_by_name: l.performedByName,
    timestamp: l.timestamp,
    old_value: l.oldValue,
    new_value: l.newValue,
  };
}

function mapSettingsFromRow(row: any): Settings {
  return {
    year: row.year,
    orgName: row.org_name,
    orgAddress: row.org_address,
    orgMobile: row.org_mobile,
    orgEmail: row.org_email,
    receiptPrefix: row.receipt_prefix,
    donationPrefix: row.donation_prefix,
    expensePrefix: row.expense_prefix,
  };
}

function mapSettingsToRow(s: Settings | Partial<Settings>): Record<string, any> {
  const row: Record<string, any> = {};
  if (s.year !== undefined) row.year = s.year;
  if (s.orgName !== undefined) row.org_name = s.orgName;
  if (s.orgAddress !== undefined) row.org_address = s.orgAddress;
  if (s.orgMobile !== undefined) row.org_mobile = s.orgMobile;
  if (s.orgEmail !== undefined) row.org_email = s.orgEmail;
  if (s.receiptPrefix !== undefined) row.receipt_prefix = s.receiptPrefix;
  if (s.donationPrefix !== undefined) row.donation_prefix = s.donationPrefix;
  if (s.expensePrefix !== undefined) row.expense_prefix = s.expensePrefix;
  return row;
}

// ----------------------------------------------------
// SUPABASE REPOSITORY IMPLEMENTATIONS
// ----------------------------------------------------

export class SupabaseDonationRepository implements DonationRepository {
  async findAll(year: number): Promise<Donation[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[SupabaseDonationRepo] Error fetching donations for year ${year}:`, error.message);
      return [];
    }
    return (data || []).map(mapDonationFromRow);
  }

  async findById(year: number, id: string): Promise<Donation | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('year', year)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDonationFromRow(data);
  }

  async create(year: number, donation: Donation): Promise<Donation> {
    const supabase = getSupabaseClient();
    const row = mapDonationToRow({ ...donation, year });
    const { data, error } = await supabase
      .from('donations')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseDonationRepo] Error creating donation:', error.message);
      throw new Error(`Failed to create donation in database: ${error.message}`);
    }
    return mapDonationFromRow(data);
  }

  async update(year: number, id: string, data: Partial<Donation>): Promise<Donation> {
    const supabase = getSupabaseClient();
    const row = mapDonationToRow(data);
    const { data: updated, error } = await supabase
      .from('donations')
      .update(row)
      .eq('year', year)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error(`[SupabaseDonationRepo] Error updating donation ${id}:`, error?.message);
      throw new Error(`Donation with ID ${id} not found or failed to update in year ${year}`);
    }
    return mapDonationFromRow(updated);
  }

  async delete(year: number, id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error, count } = await supabase
      .from('donations')
      .delete({ count: 'exact' })
      .eq('year', year)
      .eq('id', id);

    if (error) return false;
    return (count || 0) > 0;
  }
}

export class SupabaseDonationTypeRepository implements DonationTypeRepository {
  async findAll(year: number): Promise<DonationType[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('donation_types')
      .select('*')
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[SupabaseDonationTypeRepo] Error fetching types for year ${year}:`, error.message);
      return [];
    }
    return (data || []).map(mapDonationTypeFromRow);
  }

  async findById(year: number, id: string): Promise<DonationType | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('donation_types')
      .select('*')
      .eq('year', year)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDonationTypeFromRow(data);
  }

  async create(year: number, type: DonationType): Promise<DonationType> {
    const supabase = getSupabaseClient();
    const row = mapDonationTypeToRow({ ...type, year });
    const { data, error } = await supabase
      .from('donation_types')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseDonationTypeRepo] Error creating type:', error.message);
      throw new Error(`Failed to create donation type: ${error.message}`);
    }
    return mapDonationTypeFromRow(data);
  }

  async update(year: number, id: string, data: Partial<DonationType>): Promise<DonationType> {
    const supabase = getSupabaseClient();
    const row = mapDonationTypeToRow(data);
    const { data: updated, error } = await supabase
      .from('donation_types')
      .update(row)
      .eq('year', year)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`DonationType with ID ${id} not found in year ${year}`);
    }
    return mapDonationTypeFromRow(updated);
  }
}

export class SupabaseExpenseRepository implements ExpenseRepository {
  async findAll(year: number): Promise<Expense[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[SupabaseExpenseRepo] Error fetching expenses for year ${year}:`, error.message);
      return [];
    }
    return (data || []).map(mapExpenseFromRow);
  }

  async findById(year: number, id: string): Promise<Expense | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('year', year)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapExpenseFromRow(data);
  }

  async create(year: number, expense: Expense): Promise<Expense> {
    const supabase = getSupabaseClient();
    const row = mapExpenseToRow({ ...expense, year });
    const { data, error } = await supabase
      .from('expenses')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseExpenseRepo] Error creating expense:', error.message);
      throw new Error(`Failed to create expense: ${error.message}`);
    }
    return mapExpenseFromRow(data);
  }

  async update(year: number, id: string, data: Partial<Expense>): Promise<Expense> {
    const supabase = getSupabaseClient();
    const row = mapExpenseToRow(data);
    const { data: updated, error } = await supabase
      .from('expenses')
      .update(row)
      .eq('year', year)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`Expense with ID ${id} not found in year ${year}`);
    }
    return mapExpenseFromRow(updated);
  }
}

export class SupabaseReceiptRepository implements ReceiptRepository {
  async findAll(year: number): Promise<Receipt[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('year', year)
      .order('generated_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapReceiptFromRow);
  }

  async findByReceiptNo(year: number, receiptNo: string): Promise<Receipt | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('year', year)
      .eq('receipt_no', receiptNo)
      .single();

    if (error || !data) return null;
    return mapReceiptFromRow(data);
  }

  async findByDonationId(year: number, donationId: string): Promise<Receipt | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('year', year)
      .eq('donation_id', donationId)
      .single();

    if (error || !data) return null;
    return mapReceiptFromRow(data);
  }

  async create(year: number, receipt: Receipt): Promise<Receipt> {
    const supabase = getSupabaseClient();
    const row = mapReceiptToRow({ ...receipt, year });
    const { data, error } = await supabase
      .from('receipts')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseReceiptRepo] Error creating receipt:', error.message);
      throw new Error(`Failed to create receipt record: ${error.message}`);
    }
    return mapReceiptFromRow(data);
  }
}

export class SupabaseUserRepository implements UserRepository {
  async findAll(year: number): Promise<User[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[SupabaseUserRepo] Error fetching users for year ${year}:`, error.message);
      return [];
    }
    return (data || []).map(mapUserFromRow);
  }

  async findById(year: number, id: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapUserFromRow(data);
  }

  async findByEmail(year: number, email: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .single();

    if (error || !data) return null;
    return mapUserFromRow(data);
  }

  async create(year: number, user: User): Promise<User> {
    const supabase = getSupabaseClient();
    const row = mapUserToRow(user, year);
    const { data, error } = await supabase
      .from('users')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseUserRepo] Error creating user:', error.message);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    return mapUserFromRow(data);
  }

  async update(year: number, id: string, data: Partial<User>): Promise<User> {
    const supabase = getSupabaseClient();
    const row = mapUserToRow({ ...data, updatedAt: new Date().toISOString() });
    const { data: updated, error } = await supabase
      .from('users')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`User with ID ${id} not found`);
    }
    return mapUserFromRow(updated);
  }
}

export class SupabaseAuditRepository implements AuditRepository {
  async findAll(year: number): Promise<AuditLog[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('year', year)
      .order('timestamp', { ascending: false });

    if (error) return [];
    return (data || []).map(mapAuditLogFromRow);
  }

  async create(year: number, log: AuditLog): Promise<AuditLog> {
    const supabase = getSupabaseClient();
    const row = mapAuditLogToRow({ ...log, year });
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseAuditRepo] Error creating audit log:', error.message);
      throw new Error(`Failed to write audit log: ${error.message}`);
    }
    return mapAuditLogFromRow(data);
  }
}

export class SupabaseSettingsRepository implements SettingsRepository {
  async get(year: number): Promise<Settings | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('year', year)
      .single();

    if (error || !data) return null;
    return mapSettingsFromRow(data);
  }

  async update(year: number, settings: Partial<Settings>): Promise<Settings> {
    const supabase = getSupabaseClient();
    const existing = await this.get(year);
    const row = mapSettingsToRow({
      year,
      orgName: settings.orgName || existing?.orgName || 'Shree Krishna Seva Trust',
      orgAddress: settings.orgAddress || existing?.orgAddress || '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001',
      orgMobile: settings.orgMobile || existing?.orgMobile || '+91 98765 43210',
      orgEmail: settings.orgEmail || existing?.orgEmail || 'info@krishnaseva.org',
      receiptPrefix: settings.receiptPrefix || existing?.receiptPrefix || 'REC',
      donationPrefix: settings.donationPrefix || existing?.donationPrefix || 'DON',
      expensePrefix: settings.expensePrefix || existing?.expensePrefix || 'EXP',
    });

    const { data, error } = await supabase
      .from('settings')
      .upsert(row)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseSettingsRepo] Error updating settings:', error.message);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
    return mapSettingsFromRow(data);
  }
}
