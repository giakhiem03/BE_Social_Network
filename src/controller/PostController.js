import PostService from "../services/PostService";

class PostController {
    getAllPostForHomePage = async (req, res) => {
        try {
            let response = await PostService.getAllPostForHomePage();

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    addNewPost = async (req, res) => {
        try {
            let post = req.body;
            let response = await PostService.addNewPost(post);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    addNewComment = async (req, res) => {
        try {
            let comment = req.body;
            let response = await PostService.addNewComment(comment);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };

    toggleReaction = async (req, res) => {
        try {
            let { user_id, post_id } = req.query;
            let response = await PostService.toggleReaction(user_id, post_id);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({ errCode: -1, message: error });
        }
    };
}

export default new PostController();
