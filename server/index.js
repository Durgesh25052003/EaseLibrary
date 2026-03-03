import express from "express";
import { connect } from "mongoose";

import { config } from "dotenv";
import { app } from "../server/app.js";
import "../server/utils/Passport.js";

config({ path: "./.env" });

const DB_raw = process.env.MONGO_URI;

const DB = DB_raw.replace("<db_password>", process.env.DB_PASSWORD);

connect(DB).then(() => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
