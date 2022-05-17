import express from "express";

import { HomeService } from "../services/HomeService";
import { asyncRoute } from "../utils/route";

export interface CreateHomeRouteDeps {
  homeService: HomeService;
}

export function createHomeRoute({ homeService }: CreateHomeRouteDeps) {
  const router = express.Router();

  router.get(
    "/getHome",
    asyncRoute(async (req, res) => {
      const homeId = req.body.userInfo.home_id;
      const homeInfo = homeService.getHomeInfo(homeId);
      res.json({ message: `홈 정보를 불러왔습니다`, HomeInfo: homeInfo });
      return;
    }),
  ),
    router.post(
      "/postHome",
      asyncRoute(async (req, res) => {
        const homeInfo = req.body.homeInfo;
        const homeId = homeService.postHomeInfo(homeInfo);
        res.json({ message: `${homeId}번째 집으로 등록되었습니다.` });
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
