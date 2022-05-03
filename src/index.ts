import express from "express";

import { PORT, DATABASE_URI } from "./const";
import { createRoutes } from "./routes";
import { createDatabase } from "./db";
import { createServices } from "./services";
import morgan from "morgan";

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
