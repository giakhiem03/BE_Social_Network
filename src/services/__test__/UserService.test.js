import UserService from "../../services/UserService"; // Đảm bảo đường dẫn đúng với dự án của bạn
import db from "../../models"; // Giả định rằng bạn đang sử dụng Sequelize
import bcrypt from "bcrypt";

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
                    avatar: "avatar2.png",
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

    describe("getChatRoom", () => {
        const mockRoom = { id: 1, message: [] };

        test("✅ Trả về phòng chat nếu tồn tại theo kiểu user_2 - user_1", async () => {
            db.ChatRoom.findOne = jest.fn().mockResolvedValueOnce(mockRoom);

            const result = await UserService.getChatRoom(1, 2);
            expect(result).toEqual({
                errCode: 0,
                data: mockRoom,
            });
        });

        test("✅ Trả về phòng chat nếu tồn tại theo kiểu user_1 - user_2", async () => {
            db.ChatRoom.findOne = jest
                .fn()
                .mockResolvedValueOnce(null) // first try: user_2 - user_1
                .mockResolvedValueOnce(mockRoom); // second try: user_1 - user_2

            const result = await UserService.getChatRoom(1, 2);
            expect(result).toEqual({
                errCode: 0,
                data: mockRoom,
            });
        });

        test("✅ Tạo mới phòng chat nếu không tồn tại", async () => {
            db.ChatRoom.findOne = jest.fn().mockResolvedValue(null);
            db.ChatRoom.create = jest.fn().mockResolvedValue({ id: 99 });

            const result = await UserService.getChatRoom(1, 2);
            expect(result).toEqual({
                errCode: 0,
                data: { id: 99, messages: [] },
            });
        });

        test("❌ Xử lý lỗi khi có exception", async () => {
            db.ChatRoom.findOne = jest
                .fn()
                .mockRejectedValue(new Error("Database error"));

            const result = await UserService.getChatRoom(1, 2);
            expect(result).toEqual({
                errCode: -1,
                message: "Database error",
            });
        });
    });

    describe("sendMessage", () => {
        const mockMessage = {
            id: 1,
            room_chat_id: 123,
            user_id: 1,
            content: "Hello!",
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockUser = {
            id: 1,
            username: "testuser",
            avatar: "avatar.png",
        };

        test("✅ Gửi tin nhắn thành công", async () => {
            db.Message.create = jest.fn().mockResolvedValue(mockMessage);
            db.User.findOne = jest.fn().mockResolvedValue(mockUser);

            const result = await UserService.sendMessage(
                123,
                1,
                "Hello!",
                null
            );
            expect(result).toEqual({
                errCode: 0,
                message: "Send a message succeed!",
                data: {
                    id: mockMessage.id,
                    room_chat_id: mockMessage.room_chat_id,
                    user_id: mockMessage.user_id,
                    content: mockMessage.content,
                    image: mockMessage.image,
                    createdAt: mockMessage.createdAt,
                },
            });
        });

        test("❌ Xử lý lỗi khi có exception", async () => {
            db.Message.create = jest
                .fn()
                .mockRejectedValue(new Error("Create message failed"));

            const result = await UserService.sendMessage(123, 1, "Hi!", null);
            expect(result).toEqual({
                errCode: -1,
                message: "Create message failed",
            });
        });
    });

    describe("registerAccount", () => {
        const user = {
            username: "testuser_1",
            password: "123456",
            email: "test@gmail.com",
        };

        test("✅ Tạo tài khoản thành công", async () => {
            db.User.findOne = jest.fn().mockResolvedValue(null);
            db.User.create = jest.fn().mockResolvedValue(true);
            bcrypt.hashSync = jest.fn().mockReturnValue("hashedPassword");

            const result = await UserService.registerAccount(user);

            expect(result).toEqual({
                errCode: 0,
                message: "Create a user succeed!",
            });
            expect(user.password).toBe("hashedPassword");
        });

        test("⚠️ Tài khoản đã tồn tại", async () => {
            db.User.findOne = jest
                .fn()
                .mockResolvedValue({ username: "testuser" });

            const result = await UserService.registerAccount(user);

            expect(result).toEqual({
                errCode: 1,
                message: "username already exists!",
            });
        });

        test("❌ Xử lý lỗi khi có exception", async () => {
            db.User.findOne = jest
                .fn()
                .mockRejectedValue(new Error("Database error"));

            const result = await UserService.registerAccount(user);

            expect(result).toEqual({
                errCode: -1,
                message: "Database error",
            });
        });
    });

    describe("loginAccount", () => {
        const mockUserWithPassword = {
            id: 1,
            username: "testuser",
            password: "hashedPassword",
            genders: { gender: "male" },
            friendship_1: [],
            friendship_2: [],
        };

        test("✅ Đăng nhập thành công", async () => {
            db.User.findOne = jest.fn().mockResolvedValue(mockUserWithPassword);
            bcrypt.compareSync = jest.fn().mockReturnValue(false);

            const result = await UserService.loginAccount("testuser", "123456");

            expect(result).toEqual({
                errCode: 0,
                data: expect.objectContaining({ username: "testuser" }),
                message: "Login succeed!",
            });
        });

        test("⚠️ Sai mật khẩu", async () => {
            db.User.findOne = jest.fn().mockResolvedValue(mockUserWithPassword);
            bcrypt.compareSync = jest.fn().mockReturnValue(false);

            const result = await UserService.loginAccount(
                "testuser",
                "wrongpass"
            );

            expect(result).toEqual({
                errCode: 1,
                message: "Wrong password! please try another password!",
            });
        });

        test("⚠️ Không tìm thấy tài khoản", async () => {
            db.User.findOne = jest.fn().mockResolvedValue(null);

            const result = await UserService.loginAccount("unknown", "pass");

            expect(result).toEqual({
                errCode: 2,
                message: "User not found",
            });
        });

        test("❌ Lỗi khi đăng nhập", async () => {
            db.User.findOne = jest
                .fn()
                .mockRejectedValue(new Error("Login error"));

            const result = await UserService.loginAccount("testuser", "123456");

            expect(result).toEqual({
                errCode: -1,
                message: "Login error",
            });
        });
    });
});
