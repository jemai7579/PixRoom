import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const app = createApp();

connectDatabase().finally(() => {
  app.listen(env.port, () => {
    console.log(`PixRoom+ API running on http://localhost:${env.port}`);
  });
});
