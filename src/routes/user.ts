import express from "express";

import { getUserId, loginRequired } from "../services/tokenLogin";
import { UserService } from "../services/userService";

export interface CreateUserRouteDeps {
  userService: UserService;
}

export function createUserRoute({ userService }: CreateUserRouteDeps) {
  const router = express.Router();

  router.get("/", loginRequired(), (req, res) => {
    const userId = getUserId(req);
    /**
     * @swagger
     * paths:
     *   /user:
     *     get:
     *       tags:
     *       - "user"
     *       description: " 토큰로그인 결과"
     *       security:
     *          - jwt: []
     *       responses:
     *         "200":
     *           description: 로그인 성공
     *   /user/userInfo:
     *     get:
     *       tags:
     *       - "user"
     *       description: "내 유저정보 불러오기"
     *       security:
     *         - jwt: []
     *       responses:
     *         "200":
     *           description: 유저 정보 불러오기 성공
     *           content:
     *             application/json:
     *               schema:
     *                 type: object
     *                 properties:
     *                      HomeId:
     *                        type: number
     *                      gender:
     *                        type: string
     *                      nickname:
     *                        type: string
     *   /user/userUpdate:
     *     post:
     *       tags:
     *       - "user"
     *       description: "유저 정보 수정"
     *       security:
     *         - jwt: []
     *       parameters:
     *       - name: "userInfo"
     *         in: body
     *         description: 수정할 유저 정보
     *         schema:
     *           type: object
     *           properties:
     *             HomeId:
     *               type: number
     *             gender:
     *               type: string
     *             nickname:
     *               type: string
     *       responses:
     *         "200":
     *           description: "유저 정보 수정 성공"
     *
     *
     * components:
     *  securitySchemes:
     *    jwt:
     *      type: "apiKey"
     *      name: "authorization"
     *      in: "header"
     */
    res.json({
      userId,
    });
  });
  router.get("/userInfo", loginRequired(), (req, res) => {
    const userId = getUserId(req);
    const userInfo = userService.getUserInfo(userId.userPk);
    res.json(userInfo);
  });
  router.post("/userUpdate", loginRequired(), (req, _res) => {
    const userpk = getUserId(req).userPk;
    const info = req.body.userInfo;
    userService.setUserInfo(userpk, info);
  });
  return router;
}
