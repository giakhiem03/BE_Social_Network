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

    searchUserByFullName = async (req, res) => {
        try {
            let { fullname } = req.query;
            let response = await UserService.searchUserByFullName(fullname);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    getDetailUser = async (req, res) => {
        try {
            let { id } = req.params;
            let response = await UserService.getDetailUser(id);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    addNewFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.addNewFriend(user_1, user_2);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    acceptRequestAddFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.acceptRequestAddFriend(
                user_1,
                user_2
            );

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    rejectRequestAddFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.rejectRequestAddFriend(
                user_1,
                user_2
            );

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };
}

export default new UserController();
