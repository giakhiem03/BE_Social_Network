import express from "express";
import PostController from "../controller/PostController";
const router = express.Router();

// api post
router.get("/", PostController.getAllPostForHomePage);
router.post("/", PostController.addNewPost);

// api comment
router.post("/comment", PostController.addNewComment);

// api reaction
router.post("/reaction", PostController.toggleReaction);

export default router;
