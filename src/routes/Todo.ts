import express from "express";

import { TodoService } from "../services/TodoService";
import { getUserId, loginRequired } from "../services/tokenLogin";
import { asyncRoute } from "../utils/route";

export interface CreateTodoRoutesDeps {
  TodoService: TodoService;
}

export function createTodoRoute({ TodoService }: CreateTodoRoutesDeps) {
  const router = express.Router();
  router.get(
    "/gettodolist",
    loginRequired,
    asyncRoute(async (req, res) => {
      console.dir("aa");
      const userPk = getUserId(req).userPk;
      console.dir(userPk);
      const List = await TodoService.getTodoList(userPk);

      res.json({ TodoList: List });
      return;
    }),
  ),
    router.post(
      "/postTodo",
      asyncRoute(async (req, res) => {
        const info = req.body;
      }),
    );

  return router;
}
