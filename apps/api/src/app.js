import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { router } from "./routes/index.js";

export function createApp() {
  const app = express();
  const uploadDir = path.resolve("uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(uploadDir));

  app.get("/", (_req, res) => {
    res.json({
      name: "PixRoom+ API",
      version: "v1",
    });
  });

  app.use("/api", router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
