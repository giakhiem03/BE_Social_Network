import express from "express";
var path = require("path");
var cors = require("cors");
import Route from "./routes";
import ConnectDB from "./db/connectDB";
import { createServer } from "http";
import { Server } from "socket.io";
import { ConnectSocket } from "./utils/socket";

const app = express();
const port = 3001;

export const server = createServer(app); // Tạo HTTP Server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

ConnectDB();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

Route(app);

ConnectSocket(io);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
