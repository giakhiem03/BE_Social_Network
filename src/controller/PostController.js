import PostService from "../services/PostService";

class PostController {
    getAllPostForHomePage = async (req, res) => {
        try {
            let { username } = req.query;
            let response = await PostService.getAllPostForHomePage(username);
            // Clone dữ liệu để tránh lỗi circular reference
            const postsWithReactionIds = response?.data?.map((post) => ({
                ...post.toJSON(), // Chuyển Sequelize Model về object JSON
                reaction: post.reaction?.map((r) => r.user_id),
            }));
            return res
                .status(200)
                .json({ errCode: 0, data: postsWithReactionIds });
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    addNewPost = async (req, res) => {
        try {
            let post = req.body;
            let response = await PostService.addNewPost(post);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    addNewComment = async (req, res) => {
        try {
            const { post_id, user_id, content } = req.body;
            const avatarPath = req.file ? `/img/${req.file.filename}` : null;
            let response = await PostService.addNewComment(
                post_id,
                user_id,
                avatarPath,
                content
            );

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    toggleReaction = async (req, res) => {
        try {
            let { user_id, post_id } = req.body;
            let response = await PostService.toggleReaction(user_id, post_id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };

    getCommentsById = async (req, res) => {
        try {
            let { id } = req.query;
            let response = await PostService.getCommentsById(id);

            return res.status(200).json(response);
        } catch (error) {
            return res
                .status(200)
                .json({ errCode: -1, message: error.message });
        }
    };
}

export default new PostController();
