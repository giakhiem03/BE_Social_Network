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

#### 2.1.1 Tính toán độ phức tạp chu trình McCabe (V(G))

Để tính độ phức tạp chu trình V(G), chúng ta sử dụng các công thức:
- V(G) = E - N + 2 (E: số cạnh, N: số nút)
- V(G) = P + 1 (P: số vùng điều kiện)
- V(G) = R (R: số vùng khép kín)

**Đếm nút (N):**
Các nút trong đồ thị bao gồm:
1. Start - Bắt đầu hàm getChatRoom
2. Try - Bắt đầu khối try
3. TH1 - Tìm phòng chat với thứ tự người dùng đảo ngược
4. Kiểm tra res1
5. Format và return kết quả từ res1
6. TH2 - Tìm phòng chat với thứ tự người dùng đúng
7. Kiểm tra res2
8. Return kết quả từ res2
9. Tạo phòng chat mới
10. Return kết quả phòng chat mới
11. Catch - Xử lý lỗi
12. End - Kết thúc hàm

Tổng số nút N = 12

**Đếm cạnh (E):**
1. a: Start → Try
2. b: Try → TH1
3. c: TH1 → Kiểm tra res1
4. d: Kiểm tra res1 (true) → Format và return
5. e: Format và return → End
6. f: Kiểm tra res1 (false) → TH2
7. g: TH2 → Kiểm tra res2
8. h: Kiểm tra res2 (true) → Return kết quả res2
9. i: Return kết quả res2 → End
10. j: Kiểm tra res2 (false) → Tạo phòng chat mới
11. k: Tạo phòng chat mới → Return kết quả phòng mới
12. l: Return kết quả phòng mới → End
13. m: Try (exception) → Catch
14. n: Catch → End

Tổng số cạnh E = 14

**Tính V(G) theo công thức E - N + 2:**
V(G) = 14 - 12 + 2 = 4

**Đếm vùng điều kiện (P):**
1. if (res1)
2. if (res2)
3. catch (error)

Số vùng điều kiện P = 3

**Tính V(G) theo công thức P + 1:**
V(G) = 3 + 1 = 4

**Đếm vùng khép kín (R):**
1. Đường đi qua res1 true
2. Đường đi qua res2 true
3. Đường đi qua res2 false (tạo phòng mới)
4. Đường đi qua catch exception

Số vùng khép kín R = 4

**Tính V(G) theo số vùng khép kín:**
V(G) = R = 4

Kết luận: Độ phức tạp chu trình McCabe V(G) = 4, tức là cần tối thiểu 4 test case để đạt độ phủ đường đầy đủ.

#### 2.1.2 Ký hiệu các cạnh trong đồ thị luồng điều khiển getChatRoom

| Ký hiệu | Mô tả cạnh |
|---------|-----------|
| a | Start → Try (Bắt đầu hàm) |
| b | Try → TH1 (Tìm phòng chat thứ tự đảo ngược) |
| c | TH1 → Kiểm tra res1 (Xem có kết quả không) |
| d | res1(true) → Format (Có kết quả, xử lý) |
| e | Format → End (Trả về kết quả phòng đã tìm thấy) |
| f | res1(false) → TH2 (Không tìm thấy, tiếp tục tìm TH2) |
| g | TH2 → Kiểm tra res2 (Xem có kết quả không) |
| h | res2(true) → Return res2 (Tìm thấy và trả kết quả) |
| i | Return res2 → End (Kết thúc hàm) |
| j | res2(false) → Tạo phòng mới (Không tìm thấy, tạo mới) |
| k | Tạo phòng mới → Return newRoom (Trả về phòng mới tạo) |
| l | Return newRoom → End (Kết thúc hàm) |
| m | Try → Catch (Xảy ra ngoại lệ) |
| n | Catch → End (Trả về thông báo lỗi) |

#### 2.1.3 Phân tích các đường đi logic trong hàm getChatRoom

| Đường | Mô tả | Điều kiện | Đường dẫn đồ thị (cạnh) |
|-------|-------|-----------|------------------|
| Đường 1 | Tìm thấy phòng chat với thứ tự người dùng đảo ngược | res1 !== null | a->b->c->d->e |
| Đường 2 | Không tìm thấy phòng chat ở trường hợp 1, tìm thấy ở TH2 | res1 === null && res2 !== null | a->b->c->f->g->h->i |
| Đường 3 | Không tìm thấy phòng chat, tạo mới | res1 === null && res2 === null | a->b->c->f->g->j->k->l |
| Đường 4 | Xảy ra lỗi | exception được ném ra | a->b->m->n |

#### Biểu diễn dạng lưu đồ:

```
    Start
      │
      ▼ a
     Try
      │
      ▼ b
     TH1
      │
      ▼ c
 Kiểm tra res1
      │
   ┌──┴──┐
   │     │
   ▼ d   ▼ f
Format  TH2
   │     │
   │     ▼ g
   │ Kiểm tra res2
   │     │
   │  ┌──┴──┐
   │  │     │
   │  ▼ h   ▼ j
   │ Return Tạo phòng
   │  res2   mới
   │  │     │
   │  │     ▼ k
   │  │    Return
   │  │    newRoom
   │  │     │
   │  │     │
   ▼  ▼     ▼
   e  i     l
      │     │
      ▼     ▼
     End    End
     
     │
     ▼ m
   Catch
     │
     ▼ n
    End
```

#### 2.1.4 Bảng chi tiết các đường đi logic với ký hiệu cạnh

| ID | Đường đi | Mô tả đường đi | Đầu vào | Điều kiện kiểm thử | Kết quả mong đợi |
|----|---------|----------------|---------|-------------------|-------------------|
| ĐĐ1 | a->b->c->d->e | Tìm thấy phòng chat với thứ tự người dùng đảo ngược | user_1=1, user_2=2 | DB có phòng chat với user_1=2, user_2=1 | `{ errCode: 0, data: { id: 10, user_1: 2, user_2: 1, user2: { fullName: "User Two" }, message: [...] } }` |
| ĐĐ2 | a->b->c->f->g->h->i | Không tìm thấy phòng chat ở TH1, tìm thấy ở TH2 | user_1=1, user_2=2 | DB không có phòng chat với user_1=2, user_2=1;<br>DB có phòng chat với user_1=1, user_2=2 | `{ errCode: 0, data: { id: 11, user_1: 1, user_2: 2, user2: { fullName: "User Two" }, message: [...] } }` |
| ĐĐ3 | a->b->c->f->g->j->k->l | Không tìm thấy phòng chat, tạo mới | user_1=3, user_2=4 | DB không có phòng chat giữa user 3 và 4 | `{ errCode: 0, data: { id: 12, user_1: 3, user_2: 4 } }` |
| ĐĐ4 | a->b->m->n | Xử lý lỗi | user_1=null, user_2="invalid" | Tham số không hợp lệ gây lỗi | `{ errCode: -1, message: "Lỗi cơ sở dữ liệu" }` |

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

#### 2.2.1 Tính toán độ phức tạp chu trình McCabe (V(G))

**Đếm nút (N):**
Các nút trong đồ thị bao gồm:
1. Start - Bắt đầu hàm sendMessage
2. Try - Bắt đầu khối try
3. Create - Tạo tin nhắn mới
4. Return success - Trả về thành công
5. Catch - Xử lý lỗi
6. Return error - Trả về lỗi
7. End - Kết thúc hàm

Tổng số nút N = 7

**Đếm cạnh (E):**
1. a: Start → Try
2. b: Try → Create
3. c: Create → Return success
4. d: Return success → End
5. e: Try → Catch (exception)
6. f: Catch → Return error
7. g: Return error → End

Tổng số cạnh E = 7

**Tính V(G) theo công thức E - N + 2:**
V(G) = 7 - 7 + 2 = 2

**Đếm vùng điều kiện (P):**
1. catch (error)

Số vùng điều kiện P = 1

**Tính V(G) theo công thức P + 1:**
V(G) = 1 + 1 = 2

**Đếm vùng khép kín (R):**
1. Đường đi thành công (không có exception)
2. Đường đi qua catch exception

Số vùng khép kín R = 2

**Tính V(G) theo số vùng khép kín:**
V(G) = R = 2

Kết luận: Độ phức tạp chu trình McCabe V(G) = 2, tức là cần tối thiểu 2 test case để đạt độ phủ đường đầy đủ.

#### 2.2.2 Ký hiệu các cạnh trong đồ thị luồng điều khiển sendMessage

| Ký hiệu | Mô tả cạnh |
|---------|-----------|
| a | Start → Try (Bắt đầu hàm) |
| b | Try → Create (Tạo tin nhắn mới) |
| c | Create → Return success (Trả về thành công) |
| d | Return success → End (Kết thúc hàm) |
| e | Try → Catch (Xảy ra ngoại lệ) |
| f | Catch → Return error (Trả về lỗi) |
| g | Return error → End (Kết thúc hàm) |

#### 2.2.3 Phân tích các đường đi logic trong hàm sendMessage

| Đường | Mô tả | Điều kiện | Đường dẫn đồ thị (cạnh) |
|-------|-------|-----------|------------------|
| Đường 1 | Gửi tin nhắn thành công | Không có lỗi xảy ra | a->b->c->d |
| Đường 2 | Xử lý lỗi khi gửi tin nhắn | Exception được ném ra | a->e->f->g |

#### Biểu diễn dạng lưu đồ:

```
    Start
      │
      ▼ a
     Try
      │
      ▼ b
    Create
      │
      ▼ c
 Return success
      │
      ▼ d
     End
     
      │
      ▼ e
    Catch
      │
      ▼ f
 Return error
      │
      ▼ g
     End
```

#### 2.2.4 Bảng chi tiết các đường đi logic với ký hiệu cạnh

| ID | Đường đi | Mô tả đường đi | Đầu vào | Điều kiện kiểm thử | Kết quả mong đợi |
|----|---------|----------------|---------|-------------------|-------------------|
| ĐĐ5 | a->b->c->d | Gửi tin nhắn thành công | room_chat_id=1, user_id=1, content="Tin nhắn test", image=null | Phòng chat 1 tồn tại | `{ errCode: 0, message: "Send a message succeed!" }` |
| ĐĐ6 | a->b->c->d | Gửi tin nhắn kèm hình ảnh thành công | room_chat_id=1, user_id=1, content="Tin nhắn với hình", image="/img/test.jpg" | Phòng chat 1 tồn tại | `{ errCode: 0, message: "Send a message succeed!" }` |
| ĐĐ7 | a->e->f->g | Lỗi khi gửi tin nhắn | room_chat_id=9999, user_id=1, content="Test", image=null | Phòng chat không tồn tại | `{ errCode: -1, message: "Lỗi cơ sở dữ liệu - Ràng buộc khóa ngoại không thỏa mãn" }` |