import express from "express";
import zod from "zod";

import { HomeService } from "../services/HomeService";
import { pastHomeService } from "../services/pastHomeService";
import { getUserId, loginRequired } from "../services/tokenLogin";
import { UserService } from "../services/userService";
import { asyncRoute } from "../utils/route";

export interface CreateHomeRouteDeps {
  homeService: HomeService;
  userService: UserService;
  pastHomeService: pastHomeService;
}

export function createHomeRoute({ homeService, userService, pastHomeService }: CreateHomeRouteDeps) {
  const router = express.Router();

  /**
   * @swagger
   * paths:
   *   /home/gethome:
   *     get:
   *       tags:
   *       - "Home"
   *       description: "내집 정보 조회"
   *       security:
   *         - jwt: []
   *       responses:
   *         "200":
   *           description: "내집 조회 성공"
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: "#definitions/homeInfo"
   *   /home/posthome:
   *     post:
   *       tags:
   *       - "Home"
   *       description: "집 정보 입력"
   *       security:
   *         - jwt: []
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#definitions/homeInfo"
   *       responses:
   *         "200":
   *           description: 집 등록 성공
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   message:
   *                     type: string
   *                     example: "집이 등록되었습니다."
   *
   *   /home/updateHome:
   *     post:
   *       tags:
   *       - "Home"
   *       description: "집 정보 수정"
   *       security:
   *         - jwt: []
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#definitions/homeInfo"
   *       responses:
   *         "200":
   *           description: 집 정보 수정 성공
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   message:
   *                     type: string
   *                     example: "?번째 row가 변경 되었습니다."
   *   /home/moveHome:
   *     post:
   *       tags:
   *       - "Home"
   *       description: "이사하기 (현재집 이전집목록으로 보내고, 유저정보에 집 아이디 삭제)"
   *       security:
   *         - jwt: []
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#definitions/pasthomeInfo"
   *       responses:
   *         "200":
   *           description: 이사 성공
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   message:
   *                     type: string
   *                     example: "이사에 성공했습니다."
   * definitions:
   *   homeInfo:
   *     type: object
   *     properties:
   *       name:
   *         type: string
   *       rentDate:
   *         type: number
   *       rentMonth:
   *         type: number
   *   pasthomeInfo:
   *     type: object
   *     properties:
   *       startDate:
   *         type: number
   *       endDate:
   *         type: number
   */
  router.get(
    "/gethome",
    loginRequired(),
    asyncRoute(async (req, res) => {
      // 할일
      // userService 만들어서 유저 정보조회하기 이런거 몰아넣기
      // 거기서 불러와서 만들 것
      //유저 정보를 db에서 조회해와서(user) -> 거기있는 홈아이디로 집정보를 또 db에서 불러오기
      //결론은 홈 서비스에서는 홈 아이디를 받아서 만들것
      //유저 서비스에서는 토큰에서 받은 유저 아이디를 이용해서 유저 정보 불러올 것

      const userPk = getUserId(req).userPk;

      const info = await userService.getUserInfo(userPk);
      if (info?.HomeId === undefined || info.HomeId === null) {
        res.json({ message: `등록된 집이 없어요` });
        return;
      }
      const homeInfo = await homeService.getHomeInfo(info.HomeId);
      console.log(homeInfo);
      res.json({ HomeInfo: homeInfo });
      return;
    }),
  );
  router.post(
    "/posthome",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      console.log(req.body);

      const validator = zod.object({
        name: zod.string(),
        rentDate: zod.number().optional(),
        rentMonth: zod.number().optional(),
      });

      const homeInfo = validator.parse(req.body);

      const homeId = await homeService.postHomeInfo(homeInfo);

      await userService.setUserInfo(userPk, { HomeId: homeId });

      res.json({ message: `집이 등록되었습니다.` });
      return;
    }),
  );
  //update
  router.post(
    "/updateHome",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const homeInfo = req.body;
      const userInfo = await userService.getUserInfo(userPk);
      if (userInfo?.HomeId === undefined || userInfo.HomeId === null) {
        res.json({ Message: "집 등록을 먼저 하고, 수정을 진행하세요" });
        return;
      }
      console.log(homeInfo);
      const homeRow = await homeService.updateHomeInfo(userInfo?.HomeId, homeInfo);
      res.json({ message: `${homeRow}번째 row가 변경 되었습니다.` });
      return;
    }),
  );

  //delete 살고있는 집 -> pastHome으로 보내고 그냥 Home은 유지
  router.post(
    "/moveHome",
    loginRequired(),
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const userInfo = await userService.getUserInfo(userPk);
      if (userInfo === null) {
        res.json({ message: "유저 정보를 불러오지 못했어요" });
        return;
      }
      console.log(req.body);

      const homeId = userInfo?.HomeId;
      if (homeId === undefined || homeId === null) {
        res.json({ message: "삭제할 집이 없어요" });
        return;
      }
      //유저정보에서 집 번호 삭제
      userInfo.HomeId = null;
      const deleteHome = await userService.setUserInfo(userPk, userInfo);

      if (deleteHome === undefined) {
        res.json({ message: "삭제하지 못했습니다." });
        return;
      }
      //이전 집 목록에 등록하기
      const pastHomeInfo = {
        homeId2: homeId,
        startDate: req.body.startDate,
        endDate: req.body.startDate,
      };
      const postedrow = await pastHomeService.postHomeInfo(userPk, pastHomeInfo);
      if (postedrow === undefined) {
        res.json({ message: "이전집등록 실패" });
        return;
      }
      // TODO: 집 삭제가 아니라 이사로 바꾸기
      //       집은 유지시키되 유저정보의 집 아이디를 삭제하는 거 + pasthome으로 보내기
      res.json({ message: `이사 성공하였습니다.` });
      return;
    }),
  );

  return router;
}
