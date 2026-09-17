import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { middleware } from "./middleware.js";
dotenv.config();
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

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

app.post("/signup", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Incorrect Inputs",
      errors: z.flattenError(parsedData.error).fieldErrors,
    });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.username,
      },
    });

    // db call
    res.json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(411).json({
      message: "User already exists with this username",
    });
  }
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
