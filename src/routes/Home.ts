import express from "express";

import { HomeService } from "../services/HomeService";
import { getUserInfo, loginRequired } from "../services/tokenLogin";
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
   *       description: "집 정보 조회"
   *       parameters:
   *       - name: "home_id"
   *         in: "query"
   *         description: "집 아이디 "
   *         required: true
   *         type: "number"
   *       responses:
   *         "200":
   *           description: 로그인 성공
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               rentDate:
   *                 type: number
   *               rentMonth:
   *                 type: number
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
   *           schema:
   *             type: object
   *             properties:
   *               message:
   *                 type: string
   *                 description: 집등록 성공 메세지
   *
   */
  router.get("/getHome", loginRequired(), (req, res) => {
    const userInfo = getUserInfo(req);
    asyncRoute(async (req, res) => {
      const homeId = req.body.home_id;
      const homeInfo = homeService.getHomeInfo(homeId);
      res.json({ HomeInfo: homeInfo });
      return;
    });
  }),
    router.post(
      "/postHome",
      asyncRoute(async (req, res) => {
        const homeInfo = req.body.homeInfo;
        const homeId = homeService.postHomeInfo(homeInfo);
        res.json({ message: `${homeId}번째 집으로 등록되었습니다.` });
        return;
      }),
    );
  //update

  return router;
}
