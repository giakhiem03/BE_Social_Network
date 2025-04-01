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
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
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
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    searchUserByFullName = async (req, res) => {
        try {
            let { fullname } = req.query;
            let response = await UserService.searchUserByFullName(fullname);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getDetailUser = async (req, res) => {
        try {
            let { id } = req.params;
            let response = await UserService.getDetailUser(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    addNewFriend = async (req, res) => {
        try {
            let { user_1, user_2 } = req.query;

            let response = await UserService.addNewFriend(user_1, user_2);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
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
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
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
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getChatRoom = async (req, res) => {
        try {
            let { id_1, id_2 } = req.query;
            let response = await UserService.getChatRoom(id_1, id_2);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    sendMessage = async (req, res) => {
        try {
            let { room_chat_id, user_id, content } = req.body;
            const image = req.file ? `/img/${req.file.filename}` : null;
            let response = await UserService.sendMessage(
                room_chat_id,
                user_id,
                content,
                image
            );

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getNotiFyRequest = async (req, res) => {
        try {
            let { id } = req.query;
            let response = await UserService.getNotiFyRequest(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getFriendList = async (req, res) => {
        try {
            let { id } = req.query;
            let response = await UserService.getFriendList(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };
}

export default new UserController();
