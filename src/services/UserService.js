import db from "../models";
import bcrypt from "bcrypt";
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
                resolve({ errCode: -1, message: error });
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
                resolve({ errCode: -1, message: error });
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
                resolve({ errCode: -1, message: error });
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
                resolve({ errCode: -1, message: error });
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
                resolve({ errCode: -1, message: error });
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
                resolve({ errCode: -1, message: error });
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
                resolve({ errCode: -1, message: error });
            }
        });
    };
}

export default new UserService();
