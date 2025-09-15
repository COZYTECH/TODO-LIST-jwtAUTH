import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./router/authRouter.js";
import taskRouter from "./router/taskRouter.js";

const app = express();
dotenv.config();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected database running!!"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRouter);
app.use("/api", taskRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
