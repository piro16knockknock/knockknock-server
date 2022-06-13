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
      if (List.length === 0) {
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
      const userPk = getUserId(req).userPk;

      const validator = zod.object({
        todoContent: zod.string(),
        date: zod.number(),
        cateId: zod.number().optional(),
        isCompleted: zod.boolean(),
      });
      const todoInfo = validator.parse(req.body);

      const todoId = await TodoService.postTodo(userPk, todoInfo);

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
      const userPk = getUserId(req).userPk;

      const validator = zod.object({
        todoId: zod.number(),
        todoContent: zod.string().optional(),
        date: zod.number().optional(),
        cateId: zod.number().optional(),
        isCompleted: zod.boolean().optional(),
      });
      const updateInfo = validator.parse(req.body);
      const todoUserPk = await TodoService.getTodouserPk(updateInfo.todoId);
      if (userPk != todoUserPk) {
        res.json({ message: "내 할일이 아니라 삭제할 권한이 없어요" });
        return;
      }

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
    "/deletetodo/:todoId",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const todoId = Number(req.params.todoId);
      if (todoId === undefined) {
        res.json({ message: "삭제할 할일의 아이디를 불러오지 못했어요" });
        return;
      }
      const todoUserPk = await TodoService.getTodouserPk(todoId);
      console.log(todoUserPk, userPk);
      if (userPk != todoUserPk) {
        res.json({ message: "내 할일이 아니라 삭제할 권한이 없어요" });
        return;
      }

      const rownum = await TodoService.deleteTodo(todoId);
      // TODO : todo의 주인이 지금 로그인된 유저가 아니라면 컷 ** 업데이트도 체크해야함
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
 *   /todo/deletetodo/{todoId}:
 *     delete:
 *       tags:
 *       - "todo"
 *       description: "할일 삭제"
 *       security:
 *         - jwt: []
 *       parameters:
 *       - name: "todoId"
 *         in: "path"
 *         required: true
 *         type: "number"
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
 *       isCompleted:
 *         type: boolean
 */
