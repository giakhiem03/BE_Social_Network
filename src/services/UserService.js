import db from "../models";
import bcrypt from "bcrypt";
import { raw } from "mysql2";
import { Op, where } from "sequelize";

class UserService {
    salt = bcrypt.genSaltSync(10);

    registerAccount = (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const passwordEncoded = bcrypt.hashSync(
                    user.password,
                    this.salt
                );
                user.password = passwordEncoded;
                user.role = 1;
                user.fullName = user.username;
                user.gender = 1;
                user.avatar = "/img/default.png";
                user.background = "/img/default.png";
                let res = await db.User.findOne({
                    where: { username: user.username },
                });
                if (res) {
                    resolve({
                        errCode: 1,
                        message: "username already exists!",
                    });
                } else {
                    await db.User.create(user);
                    resolve({ errCode: 0, message: "Create a user succeed!" });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    loginAccount = (username, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { username },
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Gender,
                            as: "genders",
                            attributes: ["gender"],
                        },
                        {
                            model: db.Friendship,
                            as: "friendship_1",
                            where: { status: 2 },
                            attributes: ["user_id_2"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_2",
                                    attributes: { exclude: "password" },
                                },
                            ],
                            required: false,
                        },
                        {
                            model: db.Friendship,
                            as: "friendship_2",
                            where: { status: 2 },
                            attributes: ["user_id_1"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_1",
                                    attributes: { exclude: "password" },
                                },
                            ],
                            required: false,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (user) {
                    let checkPW = await bcrypt.compareSync(
                        password,
                        user.password
                    );
                    if (checkPW) {
                        delete user.password;
                        resolve({
                            errCode: 0,
                            data: user,
                            message: "Login succeed!",
                        });
                    } else {
                        resolve({
                            errCode: 1,
                            message:
                                "Wrong password! please try another password!",
                        });
                    }
                } else {
                    resolve({ errCode: 2, message: "User not found" });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    loginAccountAuth = (username, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { username },
                });
                if (user) {
                    let checkPW = await bcrypt.compareSync(
                        password,
                        user.password
                    );
                    if (checkPW) {
                        resolve({
                            errCode: 0,
                            user_id: user.id,
                            message: "Login succeed!",
                        });
                    } else {
                        resolve({
                            errCode: 1,
                            message:
                                "Wrong password! please try another password!",
                        });
                    }
                } else {
                    resolve({ errCode: 2, message: "User not found" });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    getArrUserId = (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { username },
                    attributes: ["id"],
                    include: [
                        {
                            model: db.Friendship,
                            as: "friendship_1",
                            where: { status: 2 },
                            attributes: ["id"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_2",
                                    attributes: ["id"],
                                },
                            ],
                            required: false,
                        },
                        {
                            model: db.Friendship,
                            as: "friendship_2",
                            where: { status: 2 },
                            attributes: ["id"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_1",
                                    attributes: ["id"],
                                },
                            ],
                            required: false,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (user) {
                    // Lấy danh sách ID bạn bè từ cả hai bảng
                    let arr_id = [];
                    arr_id.push(user.id);
                    if (user.friendship_1) {
                        arr_id.push(user.friendship_1.user_2.id);
                    }
                    if (user.friendship_2) {
                        arr_id.push(user.friendship_2.user_1.id);
                    }
                    const arr = arr_id.filter(Boolean);
                    resolve(arr);
                } else {
                    resolve([]);
                }
            } catch (error) {
                resolve([]);
            }
        });
    };

    searchUserByFullName = (fullName) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.User.findAll({
                    where: {
                        fullName: {
                            [Op.like]: `%${fullName.trim()}%`,
                        },
                    },
                    include: [
                        {
                            model: db.Friendship,
                            as: "friendship_1",
                            where: { status: 2 },
                            attributes: ["id"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_2",
                                    attributes: ["id"],
                                },
                            ],
                            required: false,
                        },
                        {
                            model: db.Friendship,
                            as: "friendship_2",
                            where: { status: 2 },
                            attributes: ["id"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_1",
                                    attributes: ["id"],
                                },
                            ],
                            required: false,
                        },
                    ],
                    attributes: { exclude: ["password"] },
                });
                if (res && res.length > 0) {
                    const friendships = res.map((user) => {
                        // Lấy danh sách bạn bè từ friendship_1 (user_2) và friendship_2 (user_1)
                        const friends = [
                            ...user.friendship_1.map((f) => f.user_2.id),
                            ...user.friendship_2.map((f) => f.user_1.id),
                        ];
                        return {
                            id: user.id,
                            fullName: user.fullName,
                            avatar: user.avatar,
                            friends,
                        };
                    });
                    resolve({
                        errCode: 0,
                        data: friendships,
                    });
                } else {
                    resolve({
                        errCode: 0,
                        message: `Users isn't found!`,
                        data: [],
                    });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    searchUserById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { id },
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Gender,
                            as: "genders",
                            attributes: ["gender"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                if (user) {
                    resolve({
                        errCode: 0,
                        data: user,
                    });
                } else {
                    resolve({
                        errCode: 1,
                        message: "User not found!",
                    });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    getDetailUser = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.User.findOne({
                    where: { id },
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Gender,
                            as: "genders",
                            attributes: ["gender"],
                        },
                        {
                            model: db.Friendship,
                            as: "friendship_1",
                            where: { status: 2 },
                            attributes: ["user_id_2"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_2",
                                    attributes: { exclude: "password" },
                                },
                            ],
                            required: false,
                        },
                        {
                            model: db.Friendship,
                            as: "friendship_2",
                            where: { status: 2 },
                            attributes: ["user_id_1"],
                            include: [
                                {
                                    model: db.User,
                                    as: "user_1",
                                    attributes: { exclude: "password" },
                                },
                            ],
                            required: false,
                        },
                        {
                            model: db.Role,
                            attributes: ["role_name"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (res) {
                    resolve({
                        errCode: 0,
                        data: res,
                    });
                } else {
                    resolve({ errCode: 1, message: `User isn't exists!` });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    addNewFriend = (user_1, user_2) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.Friendship.findOne({
                    where: {
                        user_id_1: user_1,
                        user_id_2: user_2,
                        status: 1,
                    },
                });
                if (res) {
                    resolve({
                        errCode: 1,
                        message: "You have sent a friend request!",
                    });
                } else {
                    await db.Friendship.create({
                        user_id_1: user_1,
                        user_id_2: user_2,
                        status: 1,
                    });
                }
                resolve({
                    errCode: 0,
                    message: "Send a request add friend succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    acceptRequestAddFriend = (user_1, user_2) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.Friendship.findOne({
                    where: {
                        user_id_1: user_2,
                        user_id_2: user_1,
                        status: 1,
                    },
                });
                res.status = 2;
                await res.save();
                resolve({
                    errCode: 0,
                    message: "Update status friendship succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    rejectRequestAddFriend = (user_1, user_2) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.Friendship.findOne({
                    where: {
                        user_id_1: user_2,
                        user_id_2: user_1,
                        status: 1,
                    },
                });
                await res.destroy();
                resolve({
                    errCode: 0,
                    message: "Delete friendship succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    getChatRoom = (user_1, user_2) => {
        return new Promise(async (resolve, reject) => {
            try {
                // TH1: user_1 = user_2, user_2 = user_1
                let res1 = await db.ChatRoom.findOne({
                    where: {
                        user_1: user_2,
                        user_2: user_1,
                    },

                    attributes: ["id"],
                    include: [
                        {
                            model: db.Message,
                            as: "message",
                        },
                    ],
                });

                if (res1) {
                    return resolve({
                        errCode: 0,
                        data: res1,
                    });
                }

                // TH2: user_1 = user_1, user_2 = user_2
                let res2 = await db.ChatRoom.findOne({
                    where: {
                        user_1: user_1,
                        user_2: user_2,
                    },
                    attributes: ["id"],
                    include: [
                        {
                            model: db.Message,
                            as: "message",
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
                    data: { id: newRoom.id, messages: [] },
                });
            } catch (error) {
                return resolve({ errCode: -1, message: error.message });
            }
        });
    };

    sendMessage = (room_chat_id, user_id, content, image) => {
        return new Promise(async (resolve, reject) => {
            try {
                let newMessage = await db.Message.create({
                    room_chat_id,
                    user_id,
                    content,
                    image,
                });
                // Lấy thông tin người gửi (có thể bỏ nếu không cần)
                let userInfo = await db.User.findOne({
                    where: { id: user_id },
                    attributes: ["id", "username", "avatar"],
                });

                resolve({
                    errCode: 0,
                    message: "Send a message succeed!",
                    data: {
                        id: newMessage.id,
                        room_chat_id: newMessage.room_chat_id,
                        user_id: newMessage.user_id,
                        content: newMessage.content,
                        image: newMessage.image,
                        createdAt: newMessage.updatedAt,
                        createdAt: newMessage.createdAt,
                    },
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    getNotiFyRequest = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.Friendship.findAll({
                    where: {
                        status: 1,
                        user_id_2: id,
                    },
                    attributes: ["id"],
                    include: [
                        {
                            model: db.User,
                            as: "user_1",
                        },
                    ],
                    required: false,
                });

                if (!res || res.length === 0) {
                    return resolve({
                        errCode: 0,
                        data: [],
                    });
                }
                resolve({
                    errCode: 0,
                    data: res,
                });
            } catch (error) {
                reject({ errCode: -1, message: error.message });
            }
        });
    };

    getFriendList = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let friends = await db.Friendship.findAll({
                    where: {
                        status: 2,
                        [Op.or]: [{ user_id_1: id }, { user_id_2: id }],
                    },
                    include: [
                        {
                            model: db.User,
                            as: "user_1",
                            attributes: { exclude: "password" },
                        },
                        {
                            model: db.User,
                            as: "user_2",
                            attributes: { exclude: "password" },
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                let friendList = friends.map((friend) =>
                    +friend.user_1.id === +id ? friend.user_2 : friend.user_1
                );
                if (friendList) {
                    resolve({
                        errCode: 0,
                        data: friendList,
                    });
                }
            } catch (error) {
                reject({ errCode: -1, message: error.message });
            }
        });
    };

    updateProfile = (id, bio, fullName, avatarPath, backgroundPath) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { id },
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Gender,
                            as: "genders",
                            attributes: ["gender"],
                        },
                        {
                            model: db.Role,
                            attributes: ["role_name"],
                        },
                    ],
                });
                user.bio = bio;
                user.fullName = fullName;
                if (avatarPath) user.avatar = avatarPath;
                if (backgroundPath) user.background = backgroundPath;
                await user.save();
                resolve({
                    errCode: 0,
                    data: user,
                    message: "Profile updated successfully!",
                });
            } catch (error) {
                reject({ errCode: -1, message: error.message });
            }
        });
    };
    addNewGroup = (user_id, group_name, group_avatar) => {
        return new Promise(async (resolve, reject) => {
            try {
                let group = await db.Group.create({
                    user_id,
                    group_name,
                    group_avatar,
                });
                resolve({
                    errCode: 0,
                    message: "Create a group succeed!",
                    data: group,
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    }
}

export default new UserService();
