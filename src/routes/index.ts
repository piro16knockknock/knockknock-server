import express from "express";

import { createUserRoute } from "./user";
import { createTestRoute } from "./test";
import { Database } from "../db";
import { Services } from "../services";

interface CreateRouteDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRouteDeps) {
  const router = express.Router();

  router.use("/user", createUserRoute());
  router.use("/test", createTestRoute({ testService: services.testService }));

  return router;
}
