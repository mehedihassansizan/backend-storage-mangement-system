import cookieParser from "cookie-parser";
import cors from "cors";
import express from 'express';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import favoritesRouter from "./routes/favorite.routes.js";
import fileRouter from "./routes/file.routes.js";
import folderRouter from "./routes/folder.routes.js";
import noteRouters from "./routes/note.routes.js";
import userRouter from "./routes/user.routes.js";



// declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/notes", noteRouters);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/favorites", favoritesRouter);



export { app };

