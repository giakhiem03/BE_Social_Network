import { raw } from "mysql2";
import db from "../models";
import UserService from "./UserService";
import { Op } from "sequelize";

class PostService {
    getAllPostForHomePage = (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await UserService.getArrUserId(username);
                if (user.length > 0) {
                    let posts = await db.Post.findAll({
                        where: { post_by: { [Op.in]: user } },
                        include: [
                            {
                                model: db.User,
                                attributes: { exclude: ["password"] },
                                as: "userPost", // Người đăng bài viết
                            },
                            {
                                model: db.User_React_Post,
                                as: "reaction",
                                attributes: ["user_id"],
                            },
                        ],
                    });
                    posts = posts.reverse();
                    resolve({ errCode: 0, data: posts });
                } else {
                    resolve({ errCode: 1, message: "User not found" });
                }
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    getAllPostById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let posts = await db.Post.findAll({
                    where: { post_by: id },
                    include: [
                        {
                            model: db.User_React_Post,
                            as: "reaction",
                            attributes: ["user_id"],
                        },
                    ],
                });
                posts = posts.reverse();
                resolve({ errCode: 0, data: posts });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    addNewPost = (post_by, image, description) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!post_by || (!description && !image)) {
                    resolve({
                        errCode: 1,
                        message: "Missing required fields!",
                    });
                }
                await db.Post.create({ post_by, image, description });
                resolve({ errCode: 0, message: "Create a new post succeed!" });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    addNewComment = (post_id, user_id, image, content) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.Comment.create({ post_id, user_id, image, content });
                resolve({
                    errCode: 0,
                    message: "Create a new comment succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
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
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    getCommentsById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let comments = await db.Comment.findAll({
                    where: { post_id: id },
                    include: [
                        {
                            model: db.User,
                            attributes: { exclude: ["password"] },
                            as: "user",
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    data: comments,
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    updatePost = (id, description, image) => {
        return new Promise(async (resolve, reject) => {
            try {
                let post = await db.Post.findOne({
                    where: { id },
                });
                post.description = description;
                if (image) post.image = image;
                await post.save();
                resolve({
                    errCode: 0,
                    message: "Update post succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };

    deleteById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let post = await db.Post.findOne({
                    where: { id },
                });
                await post.destroy();
                resolve({
                    errCode: 0,
                    message: "Delete post succeed!",
                });
            } catch (error) {
                resolve({ errCode: -1, message: error.message });
            }
        });
    };
}

export default new PostService();
