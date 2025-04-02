import userRouter from "./user";
import postRouter from "./post";

function Route(app) {
    app.use("/api/user", userRouter);
    app.use("/api/post", postRouter);
    // catch 404 and forward to error handler
    // app.use(function (req, res, next) {
    //     next(createError(404));
    // });
}

export default Route;
