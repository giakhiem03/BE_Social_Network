import db from "../models";
import bcrypt from "bcrypt";
import { raw } from "mysql2";
import { Op } from "sequelize";

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
                    // attributes: { exclude: ["password"] },
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

    searchUserByFullName = (fullname) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.User.findAll({
                    where: {
                        fullname: {
                            [Op.like]: `%${fullname}%`,
                        },
                    },
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
                if (res && res.length > 0) {
                    resolve({
                        errCode: 0,
                        data: res,
                    });
                } else {
                    resolve({ errCode: 1, data: fullname });
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
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Gender,
                            as: "genders",
                            attributes: ["gender"],
                        }
                    ],
                    raw: true,
                    nest: true,
                });

                if (user) {
                    resolve({
                        errCode: 0,
                        data: user
                    });
                } else {
                    resolve({
                        errCode: 1,
                        message: "User not found!"
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
                await db.Friendship.create({
                    user_id_1: user_1,
                    user_id_2: user_2,
                    status: 1,
                });
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

    getNotiFyRequest = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.Friendship.findAll({
                    where: {
                        status: 1,
                        [Op.or]: [{ user_id_1: id }, { user_id_2: id }],
                    },
                    include: [
                        {
                            model: db.User,
                            as: "user_1",
                        },
                        {
                            model: db.User,
                            as: "user_2",
                        },
                    ],
                });

                if (!res || res.length === 0) {
                    return resolve({
                        errCode: 0,
                        data: [],
                    });
                }
                // Chỉ lấy thông tin của người còn lại (không phải id)
                let result = res.map((friendship) => {
                    let friend =
                        friendship.user_id_1 === id
                            ? friendship.user_2
                            : friendship.user_1;

                    return {
                        id: friend.id,
                        fullName: friend.fullName,
                        avatar: friend.avatar,
                        createdAt: friend.createdAt,
                    };
                });
                resolve({
                    errCode: 0,
                    data: result,
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
}

export default new UserService();
