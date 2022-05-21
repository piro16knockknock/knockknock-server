import express from "express";

import { Services } from "../services";
import { createHomeRoute } from "./Home";
import { createLoginRoute } from "./login";
import { createTestRoute } from "./test";
import { createUserRoute } from "./user";

interface CreateRouteDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRouteDeps) {
  const router = express.Router();

  router.use("/user", createUserRoute({ userService: services.UserService }));
  router.use("/test", createTestRoute({ testService: services.testService }));
  router.use("/login", createLoginRoute({ loginService: services.loginService }));
  router.use("/Home", createHomeRoute({ homeService: services.homeService, userService: services.UserService }));

  return router;
}
