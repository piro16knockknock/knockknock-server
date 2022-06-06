import express from "express";
import zod from "zod";

import { HomeService } from "../services/HomeService";
import { getUserId, loginRequired } from "../services/tokenLogin";
import { UserService } from "../services/userService";
import { asyncRoute } from "../utils/route";

export interface CreateHomeRouteDeps {
  homeService: HomeService;
  userService: UserService;
}

export function createHomeRoute({ homeService, userService }: CreateHomeRouteDeps) {
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
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   rentDate:
   *                     type: number
   *                   rentMonth:
   *                     type: number
   *   /home/posthome:
   *     post:
   *       tags:
   *       - "Home"
   *       description: "집 정보 입력"
   *       security:
   *         - jwt: []
   *       parameters:
   *       - name: "homeInfo"
   *         in: "body"
   *         description: "집정보"
   *         required: true
   *         schema:
   *           type: "object"
   *           properties:
   *             name:
   *               type: string
   *             rentDate:
   *               type: number
   *             rentMonth:
   *               type: number
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
   *                     description: "집 등록 성공 메세지"
   *
   */
  router.get(
    "/gethome",
    loginRequired,
    asyncRoute(async (req, res) => {
      // 할일
      // userService 만들어서 유저 정보조회하기 이런거 몰아넣기
      // 거기서 불러와서 만들 것
      //유저 정보를 db에서 조회해와서(user) -> 거기있는 홈아이디로 집정보를 또 db에서 불러오기
      //결론은 홈 서비스에서는 홈 아이디를 받아서 만들것
      //유저 서비스에서는 토큰에서 받은 유저 아이디를 이용해서 유저 정보 불러올 것

      const userPk = getUserId(req).userPk;
      const info = await userService.getUserInfo(userPk);

      if (info?.HomeId === undefined) {
        res.json({ message: `등록된 집이 없어요` });
        return;
      }
      const homeInfo = homeService.getHomeInfo(info.HomeId);
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

      userService.setUserInfo(userPk, { HomeId: homeId });

      res.json({ message: `집이 등록되었습니다.` });
      return;
    }),
  );
  //update
  router.post(
    "/updateHome",
    loginRequired,
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const homeInfo = req.body.homeInfo;
      const userInfo = await userService.getUserInfo(userPk);
      if (userInfo?.HomeId === undefined) {
        res.json({ Message: "집 등록을 먼저 하고, 수정을 진행하세요" });
        return;
      }
      const homeRow = homeService.updateHomeInfo(userInfo?.HomeId, homeInfo);
      res.json({ message: `${homeRow}번째 row가 변경 되었습니다.` });
      return;
    }),
  );

  //delete 살고있는 집 삭제
  router.delete(
    "/deleteHome",
    loginRequired,
    asyncRoute(async (req, res) => {
      const userPk = getUserId(req).userPk;
      const userInfo = await userService.getUserInfo(userPk);
      const homeId = userInfo?.HomeId;
      if (homeId === undefined) {
        res.json({ message: "삭제할 집이 없어요" });
        return;
      }
      const deletedHomeId = homeService.deleteHome(homeId);
      res.json({ message: `${deletedHomeId}번째 집이 삭제 되었습니다.` });
      return;
    }),
  );

  return router;
}
