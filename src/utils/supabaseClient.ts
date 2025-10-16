import { createClient } from '@supabase/supabase-js';

// FIX: Use a type assertion for `import.meta.env` to work around TypeScript errors
// when Vite's client types are not found. This resolves issues with `import.meta.env`
// being untyped without relying on a triple-slash directive that may fail in certain setups.
const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env.local");
}

// Khởi tạo và export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- BỔ SUNG CÁC HÀM HỖ TRỢ XỬ LÝ LỖI ---
export const isSupabaseError = (error: unknown): error is { message: string; code?: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

export const formatSupabaseError = (error: unknown): string => {
  if (isSupabaseError(error)) {
    const errorMessages: Record<string, string> = {
      '23505': 'Dữ liệu đã tồn tại trong hệ thống (trùng mã hoặc giá trị unique).',
      '23503': 'Không thể xóa do có dữ liệu liên quan ở bảng khác.',
      'PGRST116': 'Không tìm thấy dữ liệu hoặc bạn không có quyền truy cập.',
      '42501': 'Bạn không có quyền thực hiện thao tác này. Vui lòng kiểm tra RLS policies.',
    };

    return errorMessages[error.code || ''] || error.message;
  }
  
  return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
};
