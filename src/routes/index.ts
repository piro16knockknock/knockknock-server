import express from "express";

import { Services } from "../services";
import { createHomeRoute } from "./Home";
import { createLoginRoute } from "./login";
import { createRuleRoute } from "./Rule";
import { createTestRoute } from "./test";
import { createTodoRoute } from "./Todo";
import { createUserRoute } from "./user";

interface CreateRouteDeps {
  services: Services;
}

export function createRoutes({ services }: CreateRouteDeps) {
  const router = express.Router();

  router.use("/user", createUserRoute({ userService: services.UserService }));
  router.use("/test", createTestRoute({ testService: services.testService }));
  router.use(
    "/login",
    createLoginRoute({
      loginService: services.loginService,
      homeService: services.homeService,
      userService: services.UserService,
    }),
  );
  router.use(
    "/home",
    createHomeRoute({
      homeService: services.homeService,
      userService: services.UserService,
      pastHomeService: services.pastHomeService,
    }),
  );

  router.use("/todo", createTodoRoute({ TodoService: services.TodoService }));
  router.use("/rule", createRuleRoute({ ruleService: services.ruleService, UserService: services.UserService }));

  return router;
}
