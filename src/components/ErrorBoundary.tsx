import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Switched from class field to a constructor for state initialization
  // to improve compatibility with different build toolchains. This resolves
  // the typing issue where inherited properties like 'props' were not being recognized.
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị UI dự phòng.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Đã xảy ra lỗi.</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
                Có lỗi xảy ra trong phần này của ứng dụng. Vui lòng thử tải lại trang.
            </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
