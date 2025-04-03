const request = require("supertest");
const app = require("../../app").default; // Import file app chính
const UserService = require("../UserService"); // Giả lập service

jest.mock("../UserService"); // Mock UserService

describe("Test searchUserById API", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset mock sau mỗi test
    });

    test("✅ Trả về user khi ID hợp lệ", async () => {
        const mockUser = { id: "123", fullname: "John Doe", email: "john@example.com" };
        UserService.searchUserById.mockResolvedValue({ errCode: 0, data: mockUser });

        const res = await request(app).get("/api/search-by-id?id=123");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ errCode: 0, data: mockUser });
    });

    test("⚠️ Trả về lỗi khi ID không tồn tại", async () => {
        UserService.searchUserById.mockResolvedValue({ errCode: 1, message: "User not found" });

        const res = await request(app).get("/api/search-by-id?id=999");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ errCode: 1, message: "User not found" });
    });

    test("❌ Xử lý lỗi khi có exception", async () => {
        UserService.searchUserById.mockRejectedValue(new Error("Database error"));

        const res = await request(app).get("/api/search-by-id?id=123");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ errCode: -1, message: "Database error" });
    });
});