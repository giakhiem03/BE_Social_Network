import express from "express";
import UserController from "../controller/UserController";
const router = express.Router();

// api login
router.post("/login", UserController.loginAccount);
router.post("/register", UserController.registerAccount);
// api search
router.get("/search", UserController.searchUserByFullName);
// api get friend list
router.get("/friend-list", UserController.getFriendList);
// api add friend
router.post("/addfriend", UserController.addNewFriend);
router.post("/acceptRequestAddFriend", UserController.acceptRequestAddFriend);
router.post("/rejectRequestAddFriend", UserController.rejectRequestAddFriend);
// api chat_room/message
router.get("/get-chat-room", UserController.getChatRoom);
router.post("/send-message", UserController.sendMessage);

//get notification
router.get("/get-notify-request-friend", UserController.getNotiFyRequest);

// api get detail user
router.get("/:id", UserController.getDetailUser);
// api default
router.get("/", UserController.getHome);
export default router;
