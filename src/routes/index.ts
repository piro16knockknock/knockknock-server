import express from "express";

import { createUserRoute } from "./user";

export function createRoutes() {
  const router = express.Router();

  router.use("/user", createUserRoute());

  return router;
}
