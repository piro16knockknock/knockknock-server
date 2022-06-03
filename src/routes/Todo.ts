import express from "express";

import { TodoService } from "../services/TodoService";
import { getUserId } from "../services/tokenLogin";
import { asyncRoute } from "../utils/route";

export interface CreateTodoRoutesDeps {
  TodoService: TodoService;
}

export function createTodoRoute({ TodoService }: CreateTodoRoutesDeps) {
  const router = express.Router();

  router.get(
    "/getTodoList",
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const List = await TodoService.getTodoList(userPk);

      res.json({ TodoList: List });
      return;
    }),
  );

  return router;
}
