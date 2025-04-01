/**
 * PHÂN TÍCH PHỦ ĐƯỜNG (PATH COVERAGE) CHO CHỨC NĂNG CHAT
 * File test: chatService.test.js
 * 
 * Phân tích whitebox cho chức năng chat trong Social Network
 * Tập trung vào hai chức năng chính:
 * 1. getChatRoom - Lấy hoặc tạo mới phòng chat
 * 2. sendMessage - Gửi tin nhắn trong phòng chat
 */

import UserService from "../services/UserService";
import db from "../models";

// Mock các module và function cần thiết
jest.mock("../models", () => {
  const mockChatRoom = {
    findOne: jest.fn(),
    create: jest.fn(),
  };
  
  const mockMessage = {
    create: jest.fn(),
  };
  
  const mockUser = {
    findOne: jest.fn(),
  };
  
  return {
    ChatRoom: mockChatRoom,
    Message: mockMessage,
    User: mockUser,
  };
});

describe("Kiểm thử Whitebox chức năng Chat - Phủ đường", () => {
  // Reset tất cả mock trước mỗi test case
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  /**
   * PHÂN TÍCH ĐƯỜNG ĐI CHO HÀM getChatRoom:
   * 
   * Đường 1: Tìm thấy phòng chat với thứ tự người dùng ngược lại
   * Đường 2: Tìm thấy phòng chat với thứ tự người dùng như tham số
   * Đường 3: Không tìm thấy phòng chat, tạo mới phòng
   * Đường 4: Xảy ra lỗi trong quá trình xử lý
   */

  /**
   * TEST CASE 1: Đường đi 1 - Lấy phòng chat đã tồn tại (thứ tự người dùng ngược)
   * 
   * Kiểm tra đường đi khi tồn tại phòng chat với thứ tự người dùng ngược lại
   * (user_1 là user_2 trong database, và user_2 là user_1 trong database)
   */
  test("Đường 1: Lấy phòng chat với thứ tự người dùng ngược lại", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const user1Id = 1;
    const user2Id = 2;
    
    // Mock phản hồi từ database cho lần gọi findOne đầu tiên (thứ tự người dùng ngược)
    const mockRoom = {
      id: 10,
      user_1: user2Id,
      user_2: user1Id,
      user1: {
        fullName: "Người Dùng Hai"
      },
      message: [
        { 
          user_id: user1Id, 
          content: "Xin chào", 
          image: null 
        }
      ],
      get: jest.fn().mockReturnValue({
        id: 10,
        user_1: user2Id,
        user_2: user1Id,
        user1: {
          fullName: "Người Dùng Hai"
        },
        message: [
          { 
            user_id: user1Id, 
            content: "Xin chào", 
            image: null 
          }
        ]
      })
    };
    
    // Thiết lập mock
    db.ChatRoom.findOne.mockResolvedValueOnce(mockRoom);
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.getChatRoom(user1Id, user2Id);
    
    // Assert - Kiểm tra kết quả
    // Kiểm tra chỉ gọi findOne một lần với thứ tự người dùng ngược
    expect(db.ChatRoom.findOne).toHaveBeenCalledTimes(1);
    expect(db.ChatRoom.findOne).toHaveBeenCalledWith({
      where: {
        user_1: user2Id,
        user_2: user1Id,
      },
      include: expect.any(Array)
    });
    
    // Không cần tạo phòng chat mới
    expect(db.ChatRoom.create).not.toHaveBeenCalled();
    
    // Kiểm tra định dạng phản hồi đúng
    expect(result).toEqual({
      errCode: 0,
      data: expect.objectContaining({
        user2: expect.objectContaining({ 
          fullName: "Người Dùng Hai" 
        })
      })
    });
  });

  /**
   * TEST CASE 2: Đường đi 2 - Lấy phòng chat với thứ tự người dùng như tham số
   * 
   * Kiểm tra đường đi khi tồn tại phòng chat với thứ tự người dùng đúng như tham số
   * (user_1 là user_1 trong DB, user_2 là user_2 trong DB)
   */
  test("Đường 2: Lấy phòng chat với thứ tự người dùng như tham số", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const user1Id = 1;
    const user2Id = 2;
    
    // Mock phản hồi cho lần gọi findOne đầu tiên (thứ tự người dùng ngược) - không tìm thấy
    db.ChatRoom.findOne.mockResolvedValueOnce(null);
    
    // Mock phản hồi cho lần gọi findOne thứ hai (thứ tự người dùng như tham số) - tìm thấy
    const mockRoom = {
      id: 11,
      user_1: user1Id,
      user_2: user2Id,
      user2: {
        fullName: "Người Dùng Hai"
      },
      message: [
        { 
          user_id: user1Id, 
          content: "Xin chào", 
          image: null 
        }
      ]
    };
    
    db.ChatRoom.findOne.mockResolvedValueOnce(mockRoom);
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.getChatRoom(user1Id, user2Id);
    
    // Assert - Kiểm tra kết quả
    // Kiểm tra findOne được gọi 2 lần với các tham số đúng
    expect(db.ChatRoom.findOne).toHaveBeenCalledTimes(2);
    
    // Lần gọi đầu tiên với thứ tự người dùng ngược
    expect(db.ChatRoom.findOne.mock.calls[0][0]).toEqual({
      where: {
        user_1: user2Id,
        user_2: user1Id,
      },
      include: expect.any(Array)
    });
    
    // Lần gọi thứ hai với thứ tự người dùng đúng như tham số
    expect(db.ChatRoom.findOne.mock.calls[1][0]).toEqual({
      where: {
        user_1: user1Id,
        user_2: user2Id,
      },
      include: expect.any(Array)
    });
    
    // Không tạo phòng chat mới
    expect(db.ChatRoom.create).not.toHaveBeenCalled();
    
    // Kiểm tra định dạng phản hồi đúng
    expect(result).toEqual({
      errCode: 0,
      data: mockRoom
    });
  });

  /**
   * TEST CASE 3: Đường đi 3 - Tạo phòng chat mới khi chưa tồn tại
   * 
   * Kiểm tra đường đi khi không tìm thấy phòng chat giữa hai người dùng
   * và cần tạo mới một phòng chat
   */
  test("Đường 3: Tạo phòng chat mới khi chưa tồn tại", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const user1Id = 3;
    const user2Id = 4;
    
    // Cả hai lần gọi findOne đều trả về null (không tìm thấy phòng chat)
    db.ChatRoom.findOne.mockResolvedValueOnce(null); // Lần gọi đầu tiên (thứ tự người dùng ngược)
    db.ChatRoom.findOne.mockResolvedValueOnce(null); // Lần gọi thứ hai (thứ tự người dùng như tham số)
    
    // Mock phản hồi cho việc tạo phòng chat mới
    const mockNewRoom = {
      id: 12,
      user_1: user1Id,
      user_2: user2Id
    };
    db.ChatRoom.create.mockResolvedValueOnce(mockNewRoom);
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.getChatRoom(user1Id, user2Id);
    
    // Assert - Kiểm tra kết quả
    // Kiểm tra đã thực hiện cả hai truy vấn
    expect(db.ChatRoom.findOne).toHaveBeenCalledTimes(2);
    
    // Kiểm tra việc tạo phòng chat mới với tham số đúng
    expect(db.ChatRoom.create).toHaveBeenCalledWith({
      user_1: user1Id,
      user_2: user2Id,
    });
    
    // Kiểm tra định dạng phản hồi đúng
    expect(result).toEqual({
      errCode: 0,
      data: mockNewRoom
    });
  });

  /**
   * TEST CASE 4: Đường đi 4 - Xử lý lỗi
   * 
   * Kiểm tra đường đi khi xảy ra lỗi trong quá trình lấy phòng chat
   */
  test("Đường 4: Xử lý lỗi khi truy vấn phòng chat", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const user1Id = null;
    const user2Id = "invalid";
    
    // Tạo lỗi
    const testError = new Error("Lỗi cơ sở dữ liệu");
    testError.message = "Lỗi cơ sở dữ liệu";
    db.ChatRoom.findOne.mockRejectedValueOnce(testError);
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.getChatRoom(user1Id, user2Id);
    
    // Assert - Kiểm tra kết quả
    expect(result).toEqual({
      errCode: -1,
      message: testError.message
    });
    
    // Không cố gắng tạo phòng chat sau khi lỗi
    expect(db.ChatRoom.create).not.toHaveBeenCalled();
  });

  /**
   * PHÂN TÍCH ĐƯỜNG ĐI CHO HÀM sendMessage:
   * 
   * Đường 1: Gửi tin nhắn thành công
   * Đường 2: Lỗi khi gửi tin nhắn
   */

  /**
   * TEST CASE 5: Đường đi 1 - Gửi tin nhắn thành công
   * 
   * Kiểm tra đường đi khi tin nhắn được gửi thành công trong phòng chat
   */
  test("Đường 1: Gửi tin nhắn thành công", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const params = {
      room_chat_id: 1,
      user_id: 1,
      content: "Tin nhắn test",
      image: null
    };
    
    // Mock thành công khi tạo tin nhắn
    db.Message.create.mockResolvedValueOnce({
      id: 100,
      ...params
    });
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.sendMessage(
      params.room_chat_id,
      params.user_id,
      params.content,
      params.image
    );
    
    // Assert - Kiểm tra kết quả
    // Kiểm tra gọi Message.create với tham số đúng
    expect(db.Message.create).toHaveBeenCalledWith({
      room_chat_id: params.room_chat_id,
      user_id: params.user_id,
      content: params.content,
      image: params.image,
    });
    
    // Kiểm tra phản hồi đúng định dạng
    expect(result).toEqual({
      errCode: 0,
      message: "Send a message succeed!"
    });
  });

  /**
   * TEST CASE 6: Đường đi 1b - Gửi tin nhắn kèm hình ảnh thành công
   * 
   * Kiểm tra biến thể khác của đường đi thành công
   * khi tin nhắn kèm hình ảnh được gửi
   */
  test("Đường 1b: Gửi tin nhắn kèm hình ảnh thành công", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const params = {
      room_chat_id: 1,
      user_id: 1,
      content: "Tin nhắn với hình ảnh",
      image: "/img/test.jpg"
    };
    
    // Mock thành công khi tạo tin nhắn
    db.Message.create.mockResolvedValueOnce({
      id: 101,
      ...params
    });
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.sendMessage(
      params.room_chat_id,
      params.user_id,
      params.content,
      params.image
    );
    
    // Assert - Kiểm tra kết quả
    // Kiểm tra gọi Message.create với tham số đúng kèm hình ảnh
    expect(db.Message.create).toHaveBeenCalledWith({
      room_chat_id: params.room_chat_id,
      user_id: params.user_id,
      content: params.content,
      image: params.image,
    });
    
    // Kiểm tra phản hồi đúng định dạng
    expect(result).toEqual({
      errCode: 0,
      message: "Send a message succeed!"
    });
  });

  /**
   * TEST CASE 7: Đường đi 2 - Xử lý lỗi khi gửi tin nhắn
   * 
   * Kiểm tra đường đi khi xảy ra lỗi trong quá trình gửi tin nhắn
   */
  test("Đường 2: Xử lý lỗi khi gửi tin nhắn", async () => {
    // Arrange - Chuẩn bị dữ liệu
    const params = {
      room_chat_id: 9999, // Phòng chat không tồn tại
      user_id: 1,
      content: "Tin nhắn test",
      image: null
    };
    
    // Tạo lỗi
    const testError = new Error("Lỗi cơ sở dữ liệu - Ràng buộc khóa ngoại không thỏa mãn");
    db.Message.create.mockRejectedValueOnce(testError);
    
    // Act - Thực thi hàm cần kiểm thử
    const result = await UserService.sendMessage(
      params.room_chat_id,
      params.user_id,
      params.content,
      params.image
    );
    
    // Assert - Kiểm tra kết quả
    expect(result).toEqual({
      errCode: -1,
      message: testError.message
    });
  });
});