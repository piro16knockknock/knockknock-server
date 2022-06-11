import express from "express";
import zod, { number } from "zod";

import { ruleService } from "../services/ruleService";
import { getUserId, loginRequired } from "../services/tokenLogin";
import { UserService } from "../services/userService";
import { asyncRoute } from "../utils/route";

export interface CreateRuleRoutesDeps {
  ruleService: ruleService;
  UserService: UserService;
}

export function createRuleRoute({ ruleService, UserService }: CreateRuleRoutesDeps) {
  const router = express.Router();

  router.get(
    "/getrulelist",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const userInfo = await UserService.getUserInfo(userPk);
      const homeId = userInfo?.HomeId;
      if (homeId == undefined || homeId == null) {
        res.json({ message: "집이 없어서 규칙을 찾을수 없어요" });
        return;
      }

      const list = await ruleService.getRuleList(homeId);
      if (list == undefined) {
        res.json({ message: "조회할 규칙 리스트가 없어요" });
        return;
      }
      res.json({ ruleList: list });
      return;
    }),
  );
  router.post(
    "/postRule",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const validator = zod.object({
        homeId: zod.number(),
        content: zod.string(),
        rulecateId: zod.number().optional(),
      });
      const postinfo = validator.parse(req.body);
      const postedrow = await ruleService.postRule(postinfo);
      if (postedrow == undefined) {
        res.json({ message: "규칙 추가에 실패했어요" });
        return;
      }
      res.json({ postedRow: postedrow });
      return;
    }),
  );
  router.post(
    "/updaterule",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const validator = zod.object({
        ruleId: number(),
        homeId: zod.number(),
        content: zod.string(),
        rulecateId: zod.number().optional(),
      });
      const updateInfo = validator.parse(req.body);
      const rownum = await ruleService.updateRule(updateInfo);
      if (rownum == undefined) {
        res.json({ message: "규칙 업데이트에 실패했어요" });
        return;
      }
      res.json({ message: `${updateInfo.ruleId}번 규칙을 수정했습니다.` });
      return;
    }),
  );
  router.delete(
    "/deleteRule",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const validator = zod.number();
      const ruleId = validator.parse(req.body);
      console.log(ruleId);
      const rownum = await ruleService.deleteRule(ruleId);

      if (rownum == undefined) {
        res.json({ message: "규칙 삭제에 실패했어요" });
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
 *   /rule/getrulelist:
 *     get:
 *       tags:
 *       - "rule"
 *       description: "규칙 조회"
 *       security:
 *         - jwt: []
 *       responses:
 *         "200":
 *           description: "규칙 조회 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   ruleList:
 *                     type: array
 *                     items:
 *                       $ref: "#definitions/ruleInfo"
 *   /rule/postrule:
 *     post:
 *       tags:
 *       - "rule"
 *       description: "추가할 할일 정보 입력 / 카테고리 설정하고싶지 않으면 0으로 넣어주세요"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#definitions/postruleInfo"
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
 *   /rule/updaterule:
 *     post:
 *       tags:
 *       - "rule"
 *       description: "할일 수정"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#definitions/ruleInfo"
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
 *   /rule/delterule:
 *     delete:
 *       tags:
 *       - "rule"
 *       description: "할일 삭제"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ruleId:
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
 *   ruleInfo:
 *     type: object
 *     properties:
 *       ruleId:
 *         type: number
 *       homeId:
 *         type: number
 *       content:
 *         type: string
 *       rulecateId:
 *         type: number
 *   postruleInfo:
 *     type: object
 *     properties:
 *       homeId:
 *         type: number
 *       content:
 *         type: string
 *       rulecateId:
 *         type: number
 */
