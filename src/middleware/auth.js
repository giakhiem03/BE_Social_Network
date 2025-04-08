import jwt from "jsonwebtoken";
import UserService from "../services/UserService";
import { JWT_SECRET } from "../utils/constants";

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token)
        return res.status(401).json({ errCode: 1, message: "Please login!" });
    let result = jwt.verify(token, JWT_SECRET);
    let user = await UserService.getDetailUser(result.id);
    delete user.data.friendship_1;
    delete user.data.friendship_2;
    if (result.expireIn > Date.now()) {
        req.user = user.data;
        next();
    } else {
        return res
            .status(401)
            .json({ errCode: -1, message: "Token is invalid or expired!" });
    }
};

// Authorization (check quyền)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.Role.role_name)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
};
