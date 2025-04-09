import { io } from "..";
import UserService from "../services/UserService";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { response } from "express";
class UserController {
    getHome = (req, res) => {
        return res.status(200).json({ message: "Hello world" });
    };

    registerAccount = async (req, res) => {
        try {
            let user = req.body;
            let response = await UserService.registerAccount(user);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    loginAccount = async (req, res) => {
        try {
            const { username, password } = req.body;
            const response = await UserService.loginAccount(username, password);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(500)
                .json({ errCode: -1, message: error.message });
        }
    };

    logoutAccount = async (req, res) => {
        try {
            res.cookie("token", "", {
                httpOnly: true,
                expires: new Date(0), // ngày quá khứ
                signed: true,
            });
            return res
                .status(200)
                .json({ errCode: 0, message: "Logged out successfully" });
        } catch (error) {
            return res
                .status(500)
                .json({ errCode: -1, message: error.message });
        }
    };

    loginAccountAuth = async (req, res) => {
        try {
            const { username, password } = req.body;
            const response = await UserService.loginAccountAuth(
                username,
                password
            );

            if (response && response.errCode === 0) {
                let exp = new Date(Date.now() + 3600 * 1000);
                let token = jwt.sign(
                    {
                        id: response.user_id,
                        expireIn: exp.getTime(),
                    },
                    JWT_SECRET
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    expires: exp,
                    signed: true,
                });

                return res.status(200).json({
                    errCode: 0,
                    data: token, // thêm token vào response
                    message: response.message,
                });
            } else {
                return res.status(500).json(response);
            }
        } catch (error) {
            return res
                .status(500)
                .json({ errCode: -1, message: error.message });
        }
    };

    searchUserByFullName = async (req, res) => {
        try {
            let { fullName } = req.query;
            let response = await UserService.searchUserByFullName(fullName);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    searchUserById = async (req, res) => {
        try {
            const { id } = req.query; // Lấy ID từ query string
            const response = await UserService.searchUserById(id); // Gọi hàm từ UserService
            return res.status(200).json(response); // Trả về kết quả
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message }); // Xử lý lỗi
        }
    };

    getDetailUser = async (req, res) => {
        try {
            let { id } = req.params;
            let response = await UserService.getDetailUser(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    addNewFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.addNewFriend(user_1, user_2);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    acceptRequestAddFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.acceptRequestAddFriend(
                user_1,
                user_2
            );

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    rejectRequestAddFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.rejectRequestAddFriend(
                user_1,
                user_2
            );

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };
    //Lưu danh sách user và socketId của họ
    // let onlineUsers = new Map();

    // io.on("connection", (socket) => {
    //     console.log(`User connected: ${socket.id}`);

    //     // Khi client gửi yêu cầu tham gia phòng chat
    //     socket.on("joinRoom", async ({ id_1, id_2 }) => {
    //         socket.join(`room_${roomId}`); // Thêm socket vào room
    //         onlineUsers.set(userId, socket.id); // Lưu userId và socketId
    //         console.log(`User ${userId} joined room ${roomId}`);
    //     });

    //     // Khi user gửi tin nhắn
    //     socket.on(
    //         "sendMessage",
    //         async ({ roomId, userId, content }) => {
    //             try {
    //                 // Lưu tin nhắn vào DB
    //                 const newMessage = await Message.create({
    //                     room_chat_id: roomId,
    //                     user_id: userId,
    //                     content: content,
    //                 });

    //                 // Phát tin nhắn đến tất cả client trong phòng
    //                 io.to(`room_${roomId}`).emit(
    //                     "receiveMessage",
    //                     newMessage
    //                 );
    //             } catch (error) {
    //                 console.error("Error saving message:", error);
    //             }
    //         }
    //     );

    //     // Khi user rời phòng hoặc mất kết nối
    //     socket.on("disconnect", () => {
    //         console.log(`User disconnected: ${socket.id}`);
    //         onlineUsers.forEach((value, key) => {
    //             if (value === socket.id) onlineUsers.delete(key);
    //         });
    //     });
    // });
    getChatRoom = async (req, res) => {
        try {
            let { id_1, id_2 } = req.query;
            let response = await UserService.getChatRoom(id_1, id_2);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    sendMessage = async (req, res) => {
        try {
            let { room_chat_id, user_id, content } = req.body;
            const image = req.file ? `/img/${req.file.filename}` : null;
            let response = await UserService.sendMessage(
                room_chat_id,
                user_id,
                content,
                image
            );

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getNotiFyRequest = async (req, res) => {
        try {
            let { id } = req.query;
            let response = await UserService.getNotiFyRequest(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getFriendList = async (req, res) => {
        try {
            let { id } = req.query;
            let response = await UserService.getFriendList(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getUserByToken = async (req, res) => {
        try {
            return res.status(200).json({ errCode: 0, data: req.user });
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    updateProfile = async (req, res) => {
        try {
            let { id, bio, fullName } = req.body;

            let avatarFile = null;
            if (req.files?.avatar?.[0]) avatarFile = req.files?.avatar?.[0];

            let backgroundFile = null;
            if (req.files?.background?.[0])
                backgroundFile = req.files?.background?.[0];

            let avatarPath = avatarFile ? `/img/${avatarFile.filename}` : null;
            let backgroundPath = backgroundFile
                ? `/img/${backgroundFile.filename}`
                : null;

            let response = await UserService.updateProfile(
                id,
                bio,
                fullName,
                avatarPath,
                backgroundPath
            );
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(response);
        }
    };

    addNewGroup = (req, res) => {
        try {
            let { groupName, members } = req.body;
            let response = UserService.addNewGroup(groupName, members);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ errCode: -1, message: error.message });
        }
    }
}

export default new UserController();
