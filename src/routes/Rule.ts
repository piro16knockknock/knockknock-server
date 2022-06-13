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
      if (list.length === 0) {
        res.json({ message: "조회할 규칙 리스트가 없어요" });
        return;
      }
      res.json({ ruleList: list });
      return;
    }),
  );
  router.post(
    "/postrule",
    loginRequired(),
    asyncRoute(async (req, res) => {
      console.log(req.body);
      const userPk = getUserId(req).userPk;

      const validator = zod.object({
        content: zod.string(),
        rulecateId: zod.number().optional(),
      });
      const postinfo = validator.parse(req.body);

      const userInfo = await UserService.getUserInfo(userPk);
      const homeId = userInfo?.HomeId;
      if (homeId === undefined || homeId === null) {
        res.json({ message: "등록된 집이 없어서 규칙을 추가할 수 없어요" });
        return;
      }
      const postedrow = await ruleService.postRule(homeId, postinfo);
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
        ruleId: zod.number(),
        content: zod.string(),
        rulecateId: zod.number().optional(),
      });
      const updateInfo = validator.parse(req.body);

      const userPk = getUserId(req).userPk;
      const userInfo = await UserService.getUserInfo(userPk);
      const userhomeId = userInfo?.HomeId;
      const rulehomeId = await ruleService.getRuleInfo(updateInfo.ruleId);
      if (userhomeId != rulehomeId) {
        res.json({ message: "변경하려는 규칙이 지금 집에 속해있지 않아서 변경할수 없어요" });
        return;
      }

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
    "/deleterule/:ruleId",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const ruleId = Number(req.params.ruleId);
      console.log(ruleId);
      if (ruleId === undefined) {
        res.json({ message: "삭제할 규칙의 아이디를 불러오지 못했어요" });
        return;
      }
      const userPk = getUserId(req).userPk;
      const userInfo = await UserService.getUserInfo(userPk);
      const userhomeId = userInfo?.HomeId;
      const rulehomeId = await ruleService.getRuleInfo(ruleId);
      if (userhomeId != rulehomeId) {
        res.json({ message: "변경하려는 규칙이 지금 집에 속해있지 않아서 변경할수 없어요" });
        return;
      }

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
 *       description: "추가할 규칙 정보 입력 / 카테고리 설정하고싶지 않으면 0으로 넣어주세요"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#definitions/postruleInfo"
 *       responses:
 *         "200":
 *           description: 규칙 등록 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "규칙이 등록되었습니다."
 *
 *   /rule/updaterule:
 *     post:
 *       tags:
 *       - "rule"
 *       description: "규칙 수정"
 *       security:
 *         - jwt: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#definitions/ruleInfo"
 *       responses:
 *         "200":
 *           description: 규칙 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "?번째 row가 변경 되었습니다."
 *   /rule/deleterule/{ruleId}:
 *     delete:
 *       tags:
 *       - "rule"
 *       description: "규칙 삭제"
 *       security:
 *         - jwt: []
 *       parameters:
 *       - name: "ruleId"
 *         in: "path"
 *         required: true
 *         type: "number"
 *
 *       responses:
 *         "200":
 *           description: 규칙 삭제 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "?번째 줄 규칙이 삭제 되었습니다."
 *
 *
 *
 * definitions:
 *   ruleInfo:
 *     type: object
 *     properties:
 *       ruleId:
 *         type: number
 *       content:
 *         type: string
 *       rulecateId:
 *         type: number
 *   postruleInfo:
 *     type: object
 *     properties:
 *       content:
 *         type: string
 *       rulecateId:
 *         type: number
 */
