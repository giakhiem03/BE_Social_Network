import userRouter from "./user";
import postRouter from "./post";

function Route(app) {
    app.use("/api/user", userRouter);
    app.use("/api/post", postRouter);
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
    }
    );
    // error handler
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: process.env.NODE_ENV === "development" ? err : {}
        });
    }
    );
}

export default Route;
