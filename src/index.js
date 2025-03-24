import express from "express";
const app = express();
const port = 3001;
var path = require("path");
var cors = require("cors");
import Route from "./routes";
import ConnectDB from "./db/connectDB";

ConnectDB();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

Route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
