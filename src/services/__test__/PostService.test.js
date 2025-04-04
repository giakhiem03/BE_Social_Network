import PostService from "../PostService";
import db from "../../models";

// Mock the database module
jest.mock("../../models", () => ({
    Post: {
        create: jest.fn(),
    },
}));

describe("addNewPost", () => {
    test("⚠️ Trả về lỗi nếu thiếu thông tin bắt buộc", async () => {
        const result = await PostService.addNewPost(null, "", "");
        expect(result).toEqual({
            errCode: 1,
            message: "Missing required fields!",
        });
    });

    test("❌ Xử lý lỗi khi có exception", async () => {
        db.Post.create = jest
            .fn()
            .mockRejectedValue(new Error("Database error"));

        const result = await PostService.addNewPost(1, "image.png", "New post");
        expect(result).toEqual({
            errCode: -1,
            message: "Database error",
        });
    });

    test("✅ Tạo bài post thành công", async () => {
        db.Post.create = jest.fn().mockResolvedValue({});

        const result = await PostService.addNewPost(1, "image.png", "New post");
        expect(result).toEqual({
            errCode: 0,
            message: "Create a new post succeed!",
        });
    });
});
