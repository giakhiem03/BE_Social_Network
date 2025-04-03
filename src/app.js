import express from "express";
import cors from "cors";
import path from "path";
import Route from "./routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Routes
Route(app);

export default app;