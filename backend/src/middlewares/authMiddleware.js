import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import SCHEMA from "../db/schema.js";

const authMiddleware = asyncHandler(
  async (req, res, next) => {
    let token;

    if (req.cookies?.auth_token) {
      try {
        // Get token from cookie
        token = req.cookies.auth_token;

        // Verify token
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "jwtsecret"
        );

        // Get user from the token
        const user = await db.query.usersTable.findFirst({
          where: eq(SCHEMA.users.id, decoded.id),
          columns: {
            password: false,
          },
        });

        if (!user) {
          res.status(401);
          throw new Error("Not authorised");
        }

        req.user = user;

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorised");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorised");
    }
  }
);

export default authMiddleware
