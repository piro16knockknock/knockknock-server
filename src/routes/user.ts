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
     *   /api/v1/user:
     *     get:
     *       tags:
     *       - "user"
     *       description: " 토큰로그인 결과"
     *       security:
     *          - jwt: []
     *       responses:
     *         "200":
     *           description: 로그인 성공
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
    const info = req.body;
    userService.setUserInfo(userpk, info);
  });
  return router;
}
