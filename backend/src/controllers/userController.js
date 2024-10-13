import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import asyncHandler from "express-async-handler";
import { db } from "../db/index.js";
import SCHEMA from "../db/schema.js";
import { cookieOptions, generateToken } from "../lib/utils.js";

export const registerUser = asyncHandler(
  async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields.");
    }

    const [userExists] = await db
      .select()
      .from(SCHEMA.users)
      .where(eq(SCHEMA.users.email, email));

    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email.");
    }

    //   Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(SCHEMA.users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    const token = generateToken(user.id);

    res.cookie("auth_token", token, cookieOptions).status(201).json({
      id: user.id,
      email: user.email,
      token,
    });
  }
);

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db
    .select()
    .from(SCHEMA.users)
    .where(eq(SCHEMA.users.email, email));

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user.id);
    res.cookie("auth_token", token, cookieOptions).json({
      id: user.id,
      email: user.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
