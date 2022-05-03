import express from "express";

import { PORT } from "./const";
import { createRoutes } from "./routes";

async function main() {
  const app = express();

  app.use("/api/v1", createRoutes());

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
}

main();
