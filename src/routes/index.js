import userRouter from "./home";
import postRouter from "./post";

function Route(app) {
    app.use("/api/user", userRouter);
    app.use("/api/post", postRouter);
}

export default Route;
