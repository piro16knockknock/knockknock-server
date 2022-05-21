import express from "express";
import jwt from "jsonwebtoken";

import { PRIVATEKEY } from "../const";
import { HomeService } from "../services/HomeService";
import { getUserId, loginRequired } from "../services/tokenLogin";
import { asyncRoute } from "../utils/route";

export interface CreateHomeRouteDeps {
  homeService: HomeService;
}

export function createHomeRoute({ homeService }: CreateHomeRouteDeps) {
  const router = express.Router();

  /**
   * @swagger
   * paths:
   *   /Home/getHome:
   *     get:
   *       tags:
   *       - "Home"
   *       description: "내집 정보 조회"
   *       parameters:
   *       - name: "home_id"
   *         in: "query"
   *         description: "집 아이디 "
   *         required: true
   *         type: "number"
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
   *   /Home/postHome:
   *     post:
   *       tags:
   *       - "Home"
   *       description: "집 정보 입력"
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
   *                   accessToken:
   *                     type: string
   *
   */
  router.get(
    "/getHome",
    loginRequired,
    asyncRoute(async (req, res) => {
      // 할일
      // userService 만들어서 유저 정보조회하기 이런거 몰아넣기
      // 거기서 불러와서 만들 것
      //유저 정보를 db에서 조회해와서(user) -> 거기있는 홈아이디로 집정보를 또 db에서 불러오기
      //결론은 홈 서비스에서는 홈 아이디를 받아서 만들것
      //유저 서비스에서는 토큰에서 받은 유저 아이디를 이용해서 유저 정보 불러올 것
      const homeId = getUserId(req).HomeId;
      if (homeId === undefined) {
        res.json({ message: `등록된 집이 없어요` });
        return;
      }
      const homeInfo = homeService.getHomeInfo(homeId);
      res.json({ HomeInfo: homeInfo });
      return;
    }),
  ),
    router.post(
      "/postHome",
      loginRequired,
      asyncRoute(async (req, res) => {
        const homeInfo = req.body.homeInfo;
        const homeId = await homeService.postHomeInfo(homeInfo);

        // 토큰 새로발급 (재발급)
        const userInfo = getUserId(req);
        userInfo.HomeId = homeId;
        const token = jwt.sign(userInfo, PRIVATEKEY);
        res.json({ message: `홈 정보가 변경된 토큰이 재발급 되었습니다.`, accessToken: token });
        return;
      }),
    ),
    //update
    router.post(
      "/updateHome",
      asyncRoute(async (req, res) => {
        const homeInfo = req.body.homeInfo;
        const homeRow = homeService.updateHomeInfo(homeInfo);
        res.json({ message: `${homeRow}번째 row가 변경 되었습니다.` });
        return;
      }),
    );

  //delete
  router.delete(
    "/deleteHome",
    asyncRoute(async (req, res) => {
      const homeId = req.body.userInfo.home_id;
      const deletedHomeId = homeService.deleteHome(homeId);
      res.json({ message: `${deletedHomeId}번째 집이 삭제 되었습니다.` });
      return;
    }),
  );

  return router;
}
