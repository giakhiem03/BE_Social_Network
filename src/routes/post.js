import express from "express";
import PostController from "../controller/PostController";
import upload from "../middleware/upload";

const router = express.Router();

// api post
router.get("/", PostController.getAllPostForHomePage);
router.get("/get-comments", PostController.getCommentsById);
router.post("/", PostController.addNewPost);

// api comment
// Thêm middleware upload.single("image") để nhận file từ formData
router.post("/comment", upload.single("image"), PostController.addNewComment);

// api reaction
router.post("/reaction", PostController.toggleReaction);

export default router;
