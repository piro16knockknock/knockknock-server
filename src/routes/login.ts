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
   *   /login/join:
   *     post:
   *       tags:
   *       - "login"
   *       description: "회원가입 하기"
   *       parameters:
   *       - name: "id"
   *         in: "query"
   *         description: "아이디"
   *         required: true
   *         type: "string"
   *       - name: "password"
   *         in: "query"
   *         description: "비밀번호"
   *         required: true
   *         type: "string"
   *       responses:
   *         "200":
   *           description: 회원가입 성공
   *           schema:
   *             type: object
   *             properties:
   *               message:
   *                 type: string
   *                 description: 회원가입 성공 메세지
   */
  router.post(
    "/login",
    asyncRoute(async (req, res) => {
      const id = req.body.id;
      const password = req.body.password;
      const token = await loginService.isLogin(id, password);
      res.json({ accessToken: token });
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
