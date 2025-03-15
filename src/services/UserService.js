import db from "../models";
import bcrypt from "bcrypt";

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
                resolve({ errCode: 2, message: error });
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
}

export default new UserService();
