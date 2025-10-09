import { createClient } from '@supabase/supabase-js';

// --- TRỰC TIẾP SỬA LỖI RUNTIME ---
// Lỗi "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')" 
// xảy ra vì môi trường thực thi này không nạp được các biến từ file .env.local,
// dẫn đến import.meta.env là undefined.
//
// GIẢI PHÁP: Để ứng dụng hoạt động ngay lập tức, chúng ta sẽ gán cứng các giá trị
// kết nối Supabase trực tiếp vào code.
//
// LƯU Ý: Đây không phải là cách làm tốt nhất cho môi trường production vì lý do
// bảo mật. Trong một dự án thực tế, bạn nên sử dụng biến môi trường.

const supabaseUrl = "https://lkubvwreysaclioxxelb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdWJ2d3JleXNhY2xpb3h4ZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NTU0MTksImV4cCI6MjA3NTUzMTQxOX0.9sGcLGe9aTn1B9Aegi2OdbrmeDI1Ruun9clEVYTlzow";

// Khởi tạo và export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
