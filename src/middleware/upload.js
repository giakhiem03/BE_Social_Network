import multer from "multer";
import path from "path";
import helpers from "./helpers";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/img/"); // Lưu trong thư mục public để client có thể truy cập
    },
    filename: function (req, file, cb) {
        cb(
            null,
            path.basename(file.originalname, path.extname(file.originalname)) +
                "-" +
                Date.now() +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage, fileFilter: helpers });

export default upload;
