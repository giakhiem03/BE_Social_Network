# Phân Tích Kiểm Thử Phủ Đường Cho Chức Năng Chat

## 1. Giới Thiệu Về Kiểm Thử Phủ Đường (Path Coverage Testing)

Kiểm thử phủ đường là một kỹ thuật kiểm thử hộp trắng (white-box testing) nhằm đảm bảo rằng tất cả các đường đi có thể xảy ra trong mã nguồn đều được kiểm thử. Mục tiêu của phương pháp này là đảm bảo rằng mỗi đường đi logic trong chương trình được thực thi ít nhất một lần trong quá trình kiểm thử.

### Ưu điểm của kiểm thử phủ đường:
- Phát hiện sớm các lỗi logic phức tạp
- Tăng độ tin cậy của phần mềm
- Xác định các đường đi không thể truy cập hoặc mã chết (dead code)
- Đảm bảo độ bao phủ cao của mã nguồn

### Áp dụng cho chức năng chat:
Trong ứng dụng mạng xã hội này, chức năng chat có hai thành phần chính:
1. **getChatRoom**: Lấy hoặc tạo mới phòng chat giữa hai người dùng
2. **sendMessage**: Gửi tin nhắn trong phòng chat

## 2. Phân Tích Các Đường Đi Trong Mã Nguồn

### 2.1 Phân tích hàm getChatRoom

```javascript
getChatRoom = (user_1, user_2) => {
    return new Promise(async (resolve, reject) => {
        try {
            // TH1: user_1 = user_2, user_2 = user_1
            let res1 = await db.ChatRoom.findOne({
                where: {
                    user_1: user_2,
                    user_2: user_1,
                },
                include: [
                    {
                        model: db.User,
                        as: "user1",
                        attributes: ["fullName"],
                    },
                    {
                        model: db.Message,
                        as: "message",
                        attributes: ["user_id", "content", "image"],
                    },
                ],
            });

            if (res1) {
                let res = res1?.get({ plain: true });
                res.user2 = res.user1;
                delete res.user1;
                return resolve({
                    errCode: 0,
                    data: res,
                });
            }

            // TH2: user_1 = user_1, user_2 = user_2
            let res2 = await db.ChatRoom.findOne({
                where: {
                    user_1: user_1,
                    user_2: user_2,
                },
                include: [
                    {
                        model: db.User,
                        as: "user2",
                        attributes: ["fullName"],
                    },
                    {
                        model: db.Message,
                        as: "message",
                        attributes: ["user_id", "content", "image"],
                    },
                ],
            });

            if (res2) {
                return resolve({
                    errCode: 0,
                    data: res2,
                });
            }

            // Nếu không có chat room nào → tạo mới
            const newRoom = await db.ChatRoom.create({
                user_1,
                user_2,
            });

            return resolve({
                errCode: 0,
                data: newRoom,
            });
        } catch (error) {
            return resolve({ errCode: -1, message: error.message });
        }
    });
};
```

#### Các đường đi logic trong hàm getChatRoom:

| Đường | Mô tả | Điều kiện |
|-------|-------|-----------|
| Đường 1 | Tìm thấy phòng chat với thứ tự người dùng đảo ngược | res1 !== null |
| Đường 2 | Không tìm thấy phòng chat ở trường hợp 1, tìm thấy ở TH2 | res1 === null && res2 !== null |
| Đường 3 | Không tìm thấy phòng chat, tạo mới | res1 === null && res2 === null |
| Đường 4 | Xảy ra lỗi | exception được ném ra |

#### Biểu diễn dạng lưu đồ:
```
Start
  ↓
Try block
  ↓
Tìm phòng chat (TH1: user_1 = user_2, user_2 = user_1)
  ↓
< Tìm thấy phòng chat TH1? >
  ├── Yes → Format dữ liệu → Return kết quả (Đường 1)
  ↓ No
Tìm phòng chat (TH2: user_1 = user_1, user_2 = user_2)
  ↓
< Tìm thấy phòng chat TH2? >
  ├── Yes → Return kết quả (Đường 2)
  ↓ No
Tạo phòng chat mới
  ↓
Return phòng chat mới (Đường 3)
  ↓
End

Catch block (Đường 4) → Return lỗi
```

### 2.2 Phân tích hàm sendMessage

```javascript
sendMessage = (room_chat_id, user_id, content, image) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Message.create({
                room_chat_id,
                user_id,
                content,
                image,
            });
            resolve({
                errCode: 0,
                message: "Send a message succeed!",
            });
        } catch (error) {
            resolve({ errCode: -1, message: error.message });
        }
    });
};
```

#### Các đường đi logic trong hàm sendMessage:

| Đường | Mô tả | Điều kiện |
|-------|-------|-----------|
| Đường 1 | Gửi tin nhắn thành công | Không có lỗi xảy ra |
| Đường 2 | Xảy ra lỗi khi gửi tin nhắn | Exception được ném ra |

#### Biểu diễn dạng lưu đồ:
```
Start
  ↓
Try block
  ↓
Tạo tin nhắn mới
  ↓
Return thành công (Đường 1)
  ↓
End

Catch block (Đường 2) → Return lỗi
```

## 3. Các Test Case Phủ Đường

Dựa trên phân tích đường đi, chúng ta cần tạo các test case sau:

### 3.1 Test Case cho getChatRoom:

1. **Test Đường 1**: Tìm thấy phòng chat với thứ tự người dùng đảo ngược
2. **Test Đường 2**: Tìm thấy phòng chat với thứ tự người dùng giống tham số
3. **Test Đường 3**: Không tìm thấy phòng chat, tạo phòng mới
4. **Test Đường 4**: Xử lý lỗi

### 3.2 Test Case cho sendMessage:

5. **Test Đường 1**: Gửi tin nhắn thành công
6. **Test Đường 1 (biến thể)**: Gửi tin nhắn kèm hình ảnh thành công
7. **Test Đường 2**: Xử lý lỗi khi gửi tin nhắn

## 4. Triển Khai Test Case Bằng Jest

File `chatService.test.js` đã triển khai các test case phủ đường như sau:

```javascript
// TEST CASE 1: Get Chat Room - Existing Room with Reversed Users (Path 1)
test("Path 1: Should return existing chat room when found with reversed users", async () => {
  // Arrange
  const user1Id = 1;
  const user2Id = 2;
  
  // Mock response from database for first findOne (reversed order)
  const mockRoom = {
    id: 10,
    user_1: user2Id,
    user_2: user1Id,
    user1: {
      fullName: "User Two"
    },
    message: [
      { 
        user_id: user1Id, 
        content: "Hello", 
        image: null 
      }
    ],
    get: jest.fn().mockReturnValue({
      id: 10,
      user_1: user2Id,
      user_2: user1Id,
      user1: {
        fullName: "User Two"
      },
      message: [
        { 
          user_id: user1Id, 
          content: "Hello", 
          image: null 
        }
      ]
    })
  };
  
  // Setup mocks
  db.ChatRoom.findOne.mockResolvedValueOnce(mockRoom);
  
  // Act
  const result = await UserService.getChatRoom(user1Id, user2Id);
  
  // Assert
  expect(db.ChatRoom.findOne).toHaveBeenCalledTimes(1);
  expect(db.ChatRoom.findOne).toHaveBeenCalledWith({
    where: {
      user_1: user2Id,
      user_2: user1Id,
    },
    include: expect.any(Array)
  });
  
  expect(db.ChatRoom.create).not.toHaveBeenCalled();
  
  expect(result).toEqual({
    errCode: 0,
    data: expect.objectContaining({
      user2: expect.objectContaining({ 
        fullName: "User Two" 
      })
    })
  });
});

// Các test case còn lại tương tự...
```

## 5. Bảng Tổng Hợp Các Test Case

| ID | Hàm | Đường đi | Mô tả | Điều kiện ban đầu | Kết quả mong đợi |
|----|-----|----------|-------|-------------------|------------------|
| TC1 | getChatRoom | Đường 1 | Tìm thấy phòng chat với thứ tự người dùng đảo ngược | Tồn tại phòng chat với user_1 = 2, user_2 = 1 | Trả về phòng chat và đúng định dạng |
| TC2 | getChatRoom | Đường 2 | Tìm thấy phòng chat với thứ tự người dùng giống tham số | Không có phòng chat với thứ tự đảo ngược, có phòng chat với thứ tự giống tham số | Trả về phòng chat và đúng định dạng |
| TC3 | getChatRoom | Đường 3 | Không tìm thấy phòng chat, tạo mới | Không tồn tại phòng chat giữa hai người dùng | Tạo và trả về phòng chat mới |
| TC4 | getChatRoom | Đường 4 | Xử lý lỗi | Gọi hàm với tham số gây lỗi | Trả về thông báo lỗi |
| TC5 | sendMessage | Đường 1 | Gửi tin nhắn thành công | Phòng chat tồn tại | Gửi tin nhắn thành công |
| TC6 | sendMessage | Đường 1 | Gửi tin nhắn kèm hình ảnh thành công | Phòng chat tồn tại | Gửi tin nhắn có hình ảnh thành công |
| TC7 | sendMessage | Đường 2 | Xử lý lỗi | Gọi hàm với tham số gây lỗi | Trả về thông báo lỗi |

## 6. Độ Phủ Đường Đạt Được

Với 7 test case trên, chúng ta đã đạt được độ phủ đường 100% cho cả hai hàm `getChatRoom` và `sendMessage`. Mỗi đường đi logic trong mã nguồn đều được kiểm thử ít nhất một lần.

## 7. Lưu Ý Và Cải Tiến

### 7.1 Lưu ý:
- **Mocking database**: Cần đảm bảo mock chính xác các hàm của Sequelize để kiểm thử chính xác
- **Race condition**: Hàm `getChatRoom` có thể gặp vấn đề race condition nếu nhiều người cùng tạo phòng chat
- **Xử lý lỗi**: Cần kiểm tra thêm các trường hợp lỗi cụ thể (không chỉ catch tổng quát)
- **Tham số đầu vào**: Cần kiểm tra tham số đầu vào trước khi truy vấn database
- **Quyền truy cập**: Chưa có kiểm tra quyền truy cập phòng chat

### 7.2 Cải tiến khuyến nghị:
1. **Thêm validation**: Kiểm tra tham số đầu vào trước khi thực hiện truy vấn
2. **Phân quyền**: Thêm cơ chế kiểm tra người dùng có quyền truy cập phòng chat hay không
3. **Transaction**: Sử dụng transaction để đảm bảo tính toàn vẹn khi tạo phòng chat và tin nhắn
4. **Pagination**: Thêm cơ chế phân trang khi lấy tin nhắn để tránh quá tải
5. **Cache**: Cân nhắc lưu cache phòng chat để tăng hiệu năng

## 8. Kết Luận

Kiểm thử phủ đường đã được thực hiện đầy đủ cho chức năng chat, bao gồm các đường đi chính và các trường hợp ngoại lệ. Tất cả các đường đi logic đã được xác định và kiểm thử, đảm bảo độ tin cậy cho chức năng chat trong ứng dụng mạng xã hội.

Độ phủ mã nguồn đạt 100% cho hai hàm `getChatRoom` và `sendMessage`, cho thấy kiểm thử đã bao phủ toàn bộ mã nguồn của chức năng chat.