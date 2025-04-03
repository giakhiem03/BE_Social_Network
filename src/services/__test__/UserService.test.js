const db = require("../../models"); // Import models
const UserService = require("../UserService").default; // Import UserService

// Mock database
jest.mock("../../models", () => ({
    User: {
        findAll: jest.fn(),
    },
}));

describe("searchUserByFullName", () => {
    test("Trả về danh sách người dùng nếu tìm thấy", async () => {
        // ARRANGE: Chuẩn bị dữ liệu giả lập
        const mockUsers = [{ id: 1, fullname: "John Doe", gender: "Male" }];
        db.User.findAll.mockResolvedValue(mockUsers);

        // ACT: Gọi hàm cần test
        const result = await UserService.searchUserByFullName("John");

        // ASSERT: Kiểm tra kết quả
        expect(result).toEqual({
            errCode: 0,
            data: mockUsers,
        });
    });

    test("Trả về fullname nếu không tìm thấy người dùng", async () => {
        // ARRANGE: Giả lập không tìm thấy user
        db.User.findAll.mockResolvedValue([]);

        // ACT
        const result = await UserService.searchUserByFullName("NonexistentUser");

        // ASSERT
        expect(result).toEqual({ errCode: 1, data: "NonexistentUser" });
    });

    test("Trả về lỗi nếu truy vấn gặp vấn đề", async () => {
        // ARRANGE: Giả lập lỗi DB
        db.User.findAll.mockRejectedValue(new Error("Database error"));

        // ACT
        const result = await UserService.searchUserByFullName("ErrorUser");

        // ASSERT
        expect(result).toEqual({ errCode: -1, message: "Database error" });
    });
});