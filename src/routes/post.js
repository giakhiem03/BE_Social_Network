import express from "express";
import PostController from "../controller/PostController";
import upload from "../middleware/upload";

const router = express.Router();

// api post
// get all post
router.get("/", PostController.getAllPostForHomePage);
// get posts from user
router.get("/profile", PostController.getAllPostById);
// add new post
router.post("/", upload.single("image"), PostController.addNewPost);

// api comment
// get comments
router.get("/get-comments", PostController.getCommentsById);
// add comment / Thêm middleware upload.single("image") để nhận file từ formData
router.post("/comment", upload.single("image"), PostController.addNewComment);

// api reaction
router.post("/reaction", PostController.toggleReaction);

export default router;
