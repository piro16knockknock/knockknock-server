import express from "express";

import { Database } from "../db";
import { Services } from "../services";
import { createLoginRoute } from "./login";
import { createTestRoute } from "./test";
import { createUserRoute } from "./user";

interface CreateRouteDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRouteDeps) {
  const router = express.Router();

  router.use("/user", createUserRoute());
  router.use("/test", createTestRoute({ testService: services.testService }));
  router.use("/login", createLoginRoute({ loginService: services.loginService }));

  return router;
}
