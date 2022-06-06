import express from "express";
import zod from "zod";

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
    loginRequired(),
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      console.dir(userPk);
      if (userPk == undefined) {
        res.json({ message: "조회할 유저 아이디가 없어요" });
        return;
      }

      const List = await TodoService.getTodoList(userPk);
      if (List == undefined) {
        res.json({ message: "조회할 리스트가 없어요" });
        return;
      }

      res.json({ TodoList: List });
      return;
    }),
  );
  router.post(
    "/posttodo",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const validator = zod.object({
        todoContent: zod.string(),
        date: zod.number(),
        cateId: zod.number(),
        userPk: zod.number(),
        isComplete: zod.boolean(),
      });

      const todoInfo = validator.parse(req.body);
      const todoId = await TodoService.postTodo(todoInfo);
      if (todoId == undefined) {
        res.json({ message: "할일 추가를 실패했어요" });
        return;
      }

      res.json({ postedtodoId: todoId });
      return;
    }),
  );
  router.post(
    "/updatetodo",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const validator = zod.object({
        todoId: zod.number(),
        todoContent: zod.string().optional(),
        date: zod.number().optional(),
        cateId: zod.number().optional(),
        userPk: zod.number().optional(),
        isComplete: zod.boolean().optional(),
      });

      const updateInfo = validator.parse(req.body);
      const rownum = await TodoService.updateTodo(updateInfo);
      if (rownum == undefined) {
        res.json({ message: "할일 업데이트에 실패했어요" });
        return;
      }

      res.json({ updatedrow: rownum });
      return;
    }),
  );

  router.delete(
    "/deltetodo",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const validator = zod.number();
      const todoId = validator.parse(req.body);
      const rownum = await TodoService.deleteTodo(todoId);

      if (rownum == undefined) {
        res.json({ message: "할일 삭제에 실패했어요" });
        return;
      }
      res.json({ deletedrow: rownum });
      return;
    }),
  );

  return router;
}
