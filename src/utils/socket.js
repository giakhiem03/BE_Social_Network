import UserService from "../services/UserService";
import fs from "fs";
import path from "path";

export const ConnectSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("⚡️ A user connected:", socket.id);

        socket.on("joinRoom", async ({ id_1, id_2 }) => {
            try {
                let chatRoom = await UserService.getChatRoom(id_1, id_2);
                socket.join(chatRoom.data.id);
                socket.emit("getChatRoom", {
                    roomId: chatRoom.data.id,
                    messages: chatRoom.data,
                });
            } catch (error) {
                socket.emit("error", {
                    message: "Không thể tham gia phòng chat",
                });
            }
        });

        // 🔥 Khi user gửi tin nhắn
        socket.on("sendMessage", async ({ roomId, userId, content, image }) => {
            try {
                let imagePath = null;
                // Nếu có ảnh Base64, lưu vào thư mục uploads
                if (image) {
                    const buffer = Buffer.from(image.split(",")[1], "base64");
                    const imageName = `upload_${Date.now()}.png`;
                    const uploadDir = path.join(
                        __dirname,
                        "..",
                        "public/upload"
                    ); // Thư mục chứa ảnh
                    // Đảm bảo thư mục tồn tại trước khi lưu ảnh
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa có
                    }

                    const uploadPath = path.join(uploadDir, imageName); // Đường dẫn file ảnh
                    fs.writeFileSync(uploadPath, buffer); // Ghi file
                    imagePath = `/upload/${imageName}`; // Đường dẫn ảnh để lưu vào DB
                }
                let newMessage = await UserService.sendMessage(
                    roomId,
                    userId,
                    content,
                    imagePath
                );
                io.to(roomId).emit("receiveMessage", newMessage); // Gửi tin nhắn đến tất cả user trong phòng
            } catch (error) {
                socket.emit("error", { message: "Không thể gửi tin nhắn" });
            }
        });

        socket.on("disconnect", () => {
            console.log("🚨 User disconnected:", socket.id);
        });
    });
};
