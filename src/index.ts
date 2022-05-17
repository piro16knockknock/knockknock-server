import express from "express";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { DATABASE_URI, PORT } from "./const";
import { createDatabase } from "./db";
import { createRoutes } from "./routes";
import { createServices } from "./services";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hello World",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    securityDefinitions: {
      api_key: {
        type: "apiKey",
        name: "jwt",
        in: "header",
      },
    },
  },
  apis: ["./src/routes/*.ts"], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);

async function main() {
  const app = express();

  const db = createDatabase({ DATABASE_URI });
  const services = createServices({ db });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification, { explorer: true }));

  app.use("/api/v1", createRoutes({ services }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
}

main();
