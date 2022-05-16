import express from "express";

import { LoginService } from "../services/loginService";
import { asyncRoute } from "../utils/route";

export interface CreateLoginRouteDeps {
  loginService: LoginService;
}

export function createLoginRoute({ loginService }: CreateLoginRouteDeps) {
  const router = express.Router();

  /**
   * @swagger
   * paths:
   *   /login/login:
   *     post:
   *       tags:
   *       - "login"
   *       description: "로그인 하기"
   *       parameters:
   *       - name: "username"
   *         in: "query"
   *         description: "The user name for login"
   *         required: true
   *         type: "string"
   *       - name: "password"
   *         in: "query"
   *         description: "The password for login in clear text"
   *         required: true
   *         type: "string"
   *       responses:
   *         "200":
   *           description: 로그인 성공
   *           schema:
   *             type: object
   *             properties:
   *               accessToken:
   *                 type: string
   *                 description: accessToken
   */
  router.post(
    "/login",
    asyncRoute(async (req, res) => {
      const id = req.body.id;
      const password = req.body.password;
      const token = await loginService.isLogin(id, password);
      res.json({ message: `로그인 되었습니다`, accessToken: token });
      return;
    }),
  ),
    router.post(
      "/join",
      asyncRoute(async (req, res) => {
        const id = req.body.id;
        const password = req.body.password;
        const name = req.body.name;
        const gender = req.body.gender;
        const nickname = req.body.nickname;
        const isJoin = loginService.isJoin(id, password, name, gender, nickname);
        if (isJoin === null) {
          res.json({ message: `회원가입 실패, 중복 아이디가 존재합니다.` });
          return;
        }
        res.json({ message: `회원가입 성공` });
        return;
      }),
    );
  return router;
}
