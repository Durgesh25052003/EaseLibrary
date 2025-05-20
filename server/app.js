import express from "express";
import cors from "cors";
import { BookRouter } from "../server/Routes/BookRoutes.js";
import UserRouter from "./Routes/UserRoutes.js";
import cookieParser from "cookie-parser";
import { startDailyRemainder } from "./Cronjob/DailyRemainderEmail.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH" ,"DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

startDailyRemainder(); //CRON JOB

app.use("/api/v1/books", BookRouter);
app.use("/api/v1/users", UserRouter);

export { app };
