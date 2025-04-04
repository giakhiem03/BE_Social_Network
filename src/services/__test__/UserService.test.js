import UserService from "../../services/UserService"; // Đảm bảo đường dẫn đúng với dự án của bạn
import db from "../../models"; // Giả định rằng bạn đang sử dụng Sequelize

jest.mock("../../models");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("UserService", () => {
    describe("searchUserById", () => {
        test("✅ Trả về user khi ID hợp lệ", async () => {
            const mockUser = {
                id: 1,
                fullName: "John Doe",
                genders: { gender: "Male" },
                email: "john@example.com",
            };

            db.User.findOne = jest.fn().mockResolvedValue(mockUser);

            const result = await UserService.searchUserById(1);
            expect(result).toEqual({
                errCode: 0,
                data: mockUser,
            });
        });

        test("⚠️ Trả về lỗi khi ID không tồn tại", async () => {
            db.User.findOne = jest.fn().mockResolvedValue(null);

            const result = await UserService.searchUserById(999);
            expect(result).toEqual({
                errCode: 1,
                message: "User not found!",
            });
        });

        test("❌ Xử lý lỗi khi có exception", async () => {
            db.User.findOne = jest
                .fn()
                .mockRejectedValue(new Error("Database error"));

            const result = await UserService.searchUserById(1);
            expect(result).toEqual({
                errCode: -1,
                message: "Database error",
            });
        });
    });

    describe("searchUserByFullName", () => {
        test("✅ Trả về danh sách người dùng nếu tìm thấy", async () => {
            const mockUsers = [
                {
                    id: 1,
                    fullName: "John Doe",
                    avatar: "avatar1.png",
                    friendship_1: [{ user_2: { id: 2 } }],
                    friendship_2: [{ user_1: { id: 3 } }],
                },
            ];

            db.User.findAll = jest.fn().mockResolvedValue(mockUsers);

            const result = await UserService.searchUserByFullName("John");
            expect(result).toEqual({
                errCode: 0,
                data: [
                    {
                        id: 1,
                        fullName: "John Doe",
                        avatar: "avatar1.png",
                        friends: [2, 3],
                    },
                ],
            });
        });

        test("⚠️ Trả về mảng rỗng nếu không tìm thấy người dùng", async () => {
            db.User.findAll = jest.fn().mockResolvedValue([]);

            const result = await UserService.searchUserByFullName("Unknown");
            expect(result).toEqual({
                errCode: 0,
                message: "Users isn't found!",
                data: [],
            });
        });

        test("❌ Xử lý lỗi khi có exception", async () => {
            db.User.findAll = jest
                .fn()
                .mockRejectedValue(new Error("Database error"));

            const result = await UserService.searchUserByFullName("John");
            expect(result).toEqual({
                errCode: -1,
                message: "Database error",
            });
        });
    });
});
