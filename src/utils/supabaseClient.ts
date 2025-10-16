import { createClient } from '@supabase/supabase-js';

// FIX: Hardcode Supabase credentials to resolve runtime and type errors
// related to `import.meta.env`. In a production environment, these should
// be handled via environment variables and proper build configuration.
const supabaseUrl = "https://lkubvwreysaclioxxelb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdWJ2d3JleXNhY2xpb3h4ZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NTU0MTksImV4cCI6MjA3NTUzMTQxOX0.9sGcLGe9aTn1B9Aegi2OdbrmeDI1Ruun9clEVYTlzow";

// Khởi tạo Supabase client với config bảo mật
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'delfi-inventory-pro',
    },
  },
});

// Type-safe error helper
export const isSupabaseError = (error: unknown): error is { message: string; code?: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

// Helper để format error messages
export const formatSupabaseError = (error: unknown): string => {
  if (isSupabaseError(error)) {
    // Map common error codes to user-friendly messages
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
