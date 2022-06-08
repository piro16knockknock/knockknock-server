import express from "express";

import { joinPayload, LoginService } from "../services/loginService";
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
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#definitions/loginInfo"
   *       responses:
   *         "200":
   *           description: 로그인 성공
   *           schema:
   *             type: object
   *             properties:
   *               accessToken:
   *                 type: "string"
   *   /login/join:
   *     post:
   *       tags:
   *       - "login"
   *       description: "회원가입 하기 / gender와 nickname은 필수 아님"
   *       requestBody:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#definitions/joinUser"
   *       responses:
   *         "200":
   *           description: 회원가입 성공
   *           schema:
   *             type: object
   *             properties:
   *               message:
   *                 type: string
   *                 description: 회원가입 성공 메세지
   *
   *
   * definitions:
   *   joinUser:
   *     type: object
   *     properties:
   *       id:
   *         type: "string"
   *       password:
   *         type: "string"
   *       name:
   *         type: "string"
   *       gender:
   *         type: "string"
   *       nickname:
   *         type: "string"
   *
   *   loginInfo:
   *     type: object
   *     properties:
   *       id:
   *         type: "string"
   *       password:
   *         type: "string"
   */
  router.post(
    "/login",
    asyncRoute(async (req, res) => {
      const id = req.body.id;
      const password = req.body.password;
      console.log(req.body);
      const token = await loginService.isLogin(id, password);
      res.json({ accessToken: token });
      return;
    }),
  );

  router.post(
    "/join",
    asyncRoute(async (req, res) => {
      const body = req.body;

      const joinPayload: joinPayload = {
        id: body.id,
        password: body.password,
        name: body.name,
        gender: body.gender,
        nickname: body.nickname,
      };

      const isJoin = await loginService.isJoin(joinPayload);
      if (isJoin === null) {
        res.status(403).json({ message: `회원가입 실패, 중복 아이디가 존재합니다.` });
        return;
      }
      res.json({ message: `회원가입 성공`, isJoin });
      return;
    }),
  );

  return router;
}
