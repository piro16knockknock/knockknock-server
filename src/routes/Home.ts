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
      const homeId = req.body.home_id;
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
    );
  //update

  return router;
}
