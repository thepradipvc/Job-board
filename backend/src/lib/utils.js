import jwt from "jsonwebtoken";

// Generate JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "jwtsecret", {
    expiresIn: "30d",
  });
};

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};
