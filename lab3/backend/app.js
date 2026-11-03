import express from "express";
import cors from "cors";

import playerRoutes from "./routes/players.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./errors/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the PuckStats API!" });
});

app.use("/api/players", playerRoutes);

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use(errorHandler);

export default app;