import cookieParser from "cookie-parser";
import dotEnv from "dotenv";
import express from "express";
import http from "http";
import path from "path";

dotEnv.config({
  path: path.join(process.cwd(), "../.env"),
});

import userRouter from "./routes/userRouter.js";
import studentRouter from './routes/studentRouter.js';
import companyRouter from './routes/companyRouter.js';
import adminRouter from './routes/adminRouter.js';
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/students", studentRouter);
app.use("/api/companies", companyRouter);
app.use("/api/admin", adminRouter);

// Serve static files from the frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(process.cwd(), "./frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("Please set to production mode"));
}

app.use(errorHandler);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});