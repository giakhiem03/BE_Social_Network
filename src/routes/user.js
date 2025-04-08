import express from "express";
import UserController from "../controller/UserController";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import upload from "../middleware/upload";

const router = express.Router();

// api login
router.post("/login", UserController.loginAccount);
router.post("/logout", UserController.logoutAccount);
router.post("/login-auth", UserController.loginAccountAuth);
router.get("/me", authenticateToken, UserController.getUserByToken);
router.post("/register", UserController.registerAccount);
router.put(
    "/update-profile",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "background", maxCount: 1 },
    ]),
    UserController.updateProfile
);
// api search
router.get(
    "/search",
    authenticateToken,
    authenticateToken,
    UserController.searchUserByFullName
);
router.get("/search-by-id", authenticateToken, UserController.searchUserById);
// api get friend list
router.get("/friend-list", authenticateToken, UserController.getFriendList);
// api add friend
router.post(
    "/addfriend",
    authenticateToken,
    authorizeRoles("user", "admin"),
    UserController.addNewFriend
);
router.post(
    "/acceptRequestAddFriend",
    authenticateToken,
    authorizeRoles("user", "admin"),
    UserController.acceptRequestAddFriend
);
router.post(
    "/rejectRequestAddFriend",
    authenticateToken,
    authorizeRoles("user", "admin"),
    UserController.rejectRequestAddFriend
);
// api chat_room/message
// router.get("/get-chat-room", UserController.getChatRoom);
// router.post(
//     "/send-message",
//     upload.single("image"),
//     UserController.sendMessage
// );

//get notification
router.get(
    "/get-notify-request-friend",
    authenticateToken,
    UserController.getNotiFyRequest
);

// api get detail user
router.get("/:id", authenticateToken, UserController.getDetailUser);
// api default
router.get("/", authenticateToken, UserController.getHome);
export default router;
