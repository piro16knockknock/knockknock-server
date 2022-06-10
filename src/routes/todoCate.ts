import express from "express";

import { TodocateService } from "../services/TodoCateService";
import { getUserId, loginRequired } from "../services/tokenLogin";
import { asyncRoute } from "../utils/route";

export interface CreatetodoCateRouteDeps {
  TodocateService: TodocateService;
}

export function createTodocateRoute({ TodocateService }: CreatetodoCateRouteDeps) {
  const router = express.Router();

  return router;
}
