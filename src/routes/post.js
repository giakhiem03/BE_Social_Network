import express from "express";
import PostController from "../controller/PostController";
import upload from "../middleware/upload";
import { authenticateToken, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// api post
// get all post
router.get("/", authenticateToken, PostController.getAllPostForHomePage);
// get posts from user
router.get("/profile", authenticateToken, PostController.getAllPostById);
// add new post
router.post(
    "/",
    authenticateToken,
    upload.single("image"),
    PostController.addNewPost
);
// update post
router.put(
    "/update-post",
    authenticateToken,
    authorizeRoles("user", "admin"),
    upload.single("image"),
    PostController.updatePost
);
// delete post
router.delete(
    "/deleteById",
    authenticateToken,
    authorizeRoles("user", "admin"),
    PostController.deleteById
);

// api comment
// get comments
router.get("/get-comments", authenticateToken, PostController.getCommentsById);
// add comment / Thêm middleware upload.single("image") để nhận file từ formData
router.post(
    "/comment",
    authenticateToken,
    authorizeRoles("user", "admin"),
    upload.single("image"),
    PostController.addNewComment
);

// api reaction
router.post(
    "/reaction",
    authenticateToken,
    authorizeRoles("user", "admin"),
    PostController.toggleReaction
);

export default router;
