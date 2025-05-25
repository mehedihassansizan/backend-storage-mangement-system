import cookieParser from "cookie-parser";
import cors from "cors";
import express from 'express';
import session from "express-session";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import copyPasteRouter from "./routes/copyPaste.routes.js";
import dataRouter from "./routes/data.routes.js";
import favoritesRouter from "./routes/favorite.routes.js";
import fileRouter from "./routes/file.routes.js";
import folderRouter from "./routes/folder.routes.js";
import noteRouters from "./routes/note.routes.js";
import secret from "./routes/private.routes.js";
import size from "./routes/size.routes.js";
import userRouter from "./routes/user.routes.js";



// declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/notes", noteRouters);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/favorites", favoritesRouter);
app.use("/api/v1/data", dataRouter);
app.use("/api/v1/item", copyPasteRouter);
app.use("/api/v1/sizes", size);
app.use("/api/v1/private", secret);




export { app };

