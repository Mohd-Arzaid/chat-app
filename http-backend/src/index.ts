import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { middleware } from "./middleware.js";
dotenv.config();
import { z } from "zod";

app.use(express.json());


const SignupSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
  email: z.email(),
});

const LoginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
});

const CreateRoomSchema = z.object({
  roomName: z.string(),
});

app.post("/signup", (req, res) => {
  const { data, success, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Incorrect Inputs",
      errors: z.flattenError(error).fieldErrors,
    });
  }
  // db call
  res.json({
    userId: 123,
  });
});

app.post("/login", (req, res) => {
  const { data, success, error } = LoginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Incorrect Inputs",
      errors: z.flattenError(error).fieldErrors,
    });
  }
  const userId = 1;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  res.json({ token });
});

app.post("/room", middleware, (req, res) => {
  const { data, success, error } = CreateRoomSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Incorrect Inputs",
      errors: z.flattenError(error).fieldErrors,
    });
  }
  // db call
  res.json({
    roomId: 123,
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
