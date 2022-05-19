import express from "express";

import { getUserInfo, loginRequired } from "../services/tokenLogin";

export function createUserRoute() {
  const router = express.Router();

  router.get("/", loginRequired(), (req, res) => {
    const userInfo = getUserInfo(req);
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
      userInfo,
    });
  });

  return router;
}
