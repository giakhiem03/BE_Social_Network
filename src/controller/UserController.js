import UserService from "../services/UserService";

class UserController {
    getHome = (req, res) => {
        return res.status(200).json({ message: "Hello world" });
    };

    registerAccount = async (req, res) => {
        try {
            let user = req.body;
            let response = await UserService.registerAccount(user);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    loginAccount = async (req, res) => {
        try {
            let user = req.body;
            let response = await UserService.loginAccount(
                user.username,
                user.password
            );

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };
}

export default new UserController();
