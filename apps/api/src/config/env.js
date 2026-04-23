import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const apiRootEnvPath = path.resolve(currentDir, "../../.env");

dotenv.config({ path: apiRootEnvPath });

if ((process.env.NODE_ENV || "development") === "development") {
  console.log("OpenAI key loaded:", Boolean(process.env.OPENAI_API_KEY));
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pixroom-plus",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "replace-this-in-production",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
};
