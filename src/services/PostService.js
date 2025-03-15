import { where } from "sequelize";
import db from "../models";

class PostService {
    getAllPostForHomePage = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let posts = await db.Post.findAll({
                    include: [
                        {
                            model: db.Comment,
                            as: "comments",
                            include: [
                                {
                                    model: db.User,
                                    attributes: { exclude: ["password"] },
                                    as: "user", // Lấy luôn thông tin user comment nếu muốn
                                },
                            ],
                        },
                        {
                            model: db.User,
                            attributes: { exclude: ["password"] },
                            as: "userPost", // Người đăng bài viết
                        },
                    ],
                });
                resolve({ errCode: 0, data: posts });
            } catch (error) {
                resolve({ errCode: -1, message: error });
            }
        });
    };

    addNewPost = (post) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.Post.create(post);
                resolve({ errCode: 0, message: "Create a new post succeed!" });
            } catch (error) {
                resolve({ errCode: -1, message: error });
            }
        });
    };

    // getAllComment = () => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let comments = await db.Comment.findAll();
    //             resolve({ errCode: 0, data: comments });
    //         } catch (error) {
    //             resolve({ errCode: -1, message: error });
    //         }
    //     });
    // };

    addNewComment = (comment) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.Comment.create(comment);
                resolve({
                    errCode: 0,
                    message: "Create a new comment succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error });
            }
        });
    };

    toggleReaction = (user_id, post_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let reaction = await db.User_React_Post.findOne({
                    where: { user_id, post_id },
                    raw: true,
                });

                let message;

                if (reaction) {
                    await db.User_React_Post.destroy({
                        where: { user_id, post_id },
                    });
                    message = "delete reaction post succeed!";
                } else {
                    await db.User_React_Post.create({
                        user_id,
                        post_id,
                    });
                    message = "reaction post succeed!";
                }

                resolve({
                    errCode: 0,
                    message: message,
                });
            } catch (error) {
                resolve({ errCode: -1, message: error });
            }
        });
    };
}

export default new PostService();
