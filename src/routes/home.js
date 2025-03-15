import express from "express";
import UserController from "../controller/UserController";
const router = express.Router();

// api
router.get("/", UserController.getHome);
router.post("/login", UserController.loginAccount);
router.post("/register", UserController.registerAccount);

export default router;
