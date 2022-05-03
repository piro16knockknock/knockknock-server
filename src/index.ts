import express from "express";
import morgan from "morgan";

import { DATABASE_URI, PORT } from "./const";
import { createDatabase } from "./db";
import { createRoutes } from "./routes";
import { createServices } from "./services";

async function main() {
  const app = express();

  const db = createDatabase({ DATABASE_URI });
  const services = createServices({ db });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api/v1", createRoutes({ services }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
}

main();
