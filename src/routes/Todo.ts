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

      res.json({ todoList: List });
      return;
    }),
  );
  router.post(
    "/posttodo",
    loginRequired(),
    asyncRoute(async (req, res) => {
      console.log(req.body);
      const validator = zod.object({
        todoContent: zod.string(),
        date: zod.number(),
        cateId: zod.number().optional(),
        userPk: zod.number(),
        isCompleted: zod.boolean(),
      });
      //카테고리 아이디가 없어서 추가를 못하는중
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
        isCompleted: zod.boolean().optional(),
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
      const todoId = validator.parse(req.body.todoId);
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

/**
 * @swagger
 * paths:
 *   /todo/gettodolist:
 *     get:
 *       tags:
 *       - "todo"
 *       description: "할일 조회"
 *       security:
 *         - jwt: []
 *       responses:
 *         "200":
 *           description: "할일 조회 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   todoList:
 *                     type: array
 *                     items:
 *                       $ref: "#definitions/todoInfo"
 *   /todo/posttodo:
 *     post:
 *       tags:
 *       - "todo"
 *       description: "추가할 할일 정보 입력 / 카테고리 설정하고싶지 않으면 0으로 넣어주세요"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#definitions/posttodoInfo"
 *       responses:
 *         "200":
 *           description: 할일 등록 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "할일이 등록되었습니다."
 *
 *   /todo/updatetodo:
 *     post:
 *       tags:
 *       - "todo"
 *       description: "할일 수정"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#definitions/todoInfo"
 *       responses:
 *         "200":
 *           description: 할일 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "?번째 row가 변경 되었습니다."
 *   /todo/deltetodo:
 *     delete:
 *       tags:
 *       - "todo"
 *       description: "할일 삭제"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todoId:
 *                   type: number
 *
 *       responses:
 *         "200":
 *           description: 할일 삭제 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "?번째 줄 할일이 삭제 되었습니다."
 *
 *
 *
 * definitions:
 *   todoInfo:
 *     type: object
 *     properties:
 *       todoId:
 *         type: number
 *       todoContent:
 *         type: string
 *       date:
 *         type: number
 *         example: "20220601"
 *       cateId:
 *         type: number
 *       userPk:
 *         type: number
 *       isCompleted:
 *         type: boolean
 *   posttodoInfo:
 *     type: object
 *     properties:
 *       todoContent:
 *         type: string
 *       date:
 *         type: number
 *         example: "20220601"
 *       cateId:
 *         type: number
 *       userPk:
 *         type: number
 *       isCompleted:
 *         type: boolean
 */
