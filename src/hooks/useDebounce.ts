import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cập nhật giá trị debounced sau một khoảng thời gian chờ
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy bỏ timeout nếu giá trị thay đổi (ví dụ: người dùng tiếp tục gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại effect nếu value hoặc delay thay đổi

  return debouncedValue;
}
