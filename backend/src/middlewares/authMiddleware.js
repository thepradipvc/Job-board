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
        const user = await db.query.users.findFirst({
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

        if (user.role === "student") {
          const [student] = await db.query.students.findFirst({
            where: eq(SCHEMA.students.userId, user.id)
          })
          req.user.studentId = student?.id
        }

        if (user.role === "company") {
          const [company] = await db.query.companies.findFirst({
            where: eq(SCHEMA.companies.userId, user.id)
          })
          req.user.companyId = company?.id
        }

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

export const adminOnly = asyncHandler(
  async (req, res, next) => {
    if (req.user && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized as an admin");
    }
    next();
  }
);

export default authMiddleware
