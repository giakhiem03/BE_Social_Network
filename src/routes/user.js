import express from "express";
import UserController from "../controller/UserController";
const router = express.Router();

// api
router.get("/", UserController.getHome);
router.post("/login", UserController.loginAccount);
router.post("/register", UserController.registerAccount);

router.get("/search", UserController.searchUserByFullName);
router.get("/:id", UserController.getDetailUser);
router.post("/addfriend", UserController.addNewFriend);
router.post("/acceptRequestAddFriend", UserController.acceptRequestAddFriend);
router.post("/rejectRequestAddFriend", UserController.rejectRequestAddFriend);

export default router;
