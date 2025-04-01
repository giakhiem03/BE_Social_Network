/**
 * Cấu hình Jest để chạy các bài test phủ đường cho chức năng chat
 * Phân tích whitebox: Kỹ thuật kiểm thử chức năng chat bằng phương pháp phủ đường
 */

module.exports = {
  // Môi trường chạy test
  testEnvironment: 'node',
  
  // Tự động xóa mock giữa các lần chạy test
  clearMocks: true,
  
  // Bật tùy chọn hiển thị thông tin chi tiết
  verbose: true,
  
  // Thư mục chứa các file test
  roots: ['<rootDir>/src/'],
  
  // Pattern để tìm các file test - tất cả các file kết thúc bằng .test.js
  testRegex: '.*\\.test\\.js$',
  
  // Chuyển đổi code sử dụng Babel để hỗ trợ cú pháp ES6/ES7
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  // Tùy chọn hiển thị coverage
  collectCoverageFrom: [
    'src/services/UserService.js',  // Tập trung đo coverage cho file này
    '!**/node_modules/**',          // Loại trừ node_modules
  ],
  
  // Cấu hình thư mục chứa báo cáo coverage
  coverageDirectory: '<rootDir>/coverage',
  
  // Định dạng báo cáo coverage
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Các thư mục bị bỏ qua khi chạy test
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],

  // Ngưỡng bao phủ tối thiểu cần đạt được cho các chức năng chat
  coverageThreshold: {
    './src/services/UserService.js': {
      branches: 80,      // Bao phủ 80% nhánh điều kiện
      functions: 80,     // Bao phủ 80% hàm
      lines: 80,         // Bao phủ 80% dòng code
      statements: 80     // Bao phủ 80% câu lệnh
    }
  },
  
  // File thiết lập môi trường cho Jest
  // setupFiles: ['<rootDir>/jest.setup.js'],

  // Tùy chọn hiển thị thông báo sau khi chạy test (tắt để tránh lỗi thiếu node-notifier)
  notify: false,
};