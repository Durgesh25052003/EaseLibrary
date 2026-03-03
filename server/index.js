import express from "express";
import { connect } from "mongoose";

import { config } from "dotenv";
import { app } from "../server/app.js";
import "../server/utils/Passport.js";

config({ path: "./.env" });

const DB = process.env.MONGO_URI;

connect(DB).then(() => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
