import express from "express";

import { HomeService } from "../services/HomeService";
import { joinPayload, LoginService } from "../services/loginService";
import { UserService } from "../services/userService";
import { asyncRoute } from "../utils/route";

export interface CreateLoginRouteDeps {
  loginService: LoginService;
  homeService: HomeService;
  userService: UserService;
}

export function createLoginRoute({ loginService, homeService, userService }: CreateLoginRouteDeps) {
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
   *           content:
   *             application/json:
   *               schema:
   *               $ref: "#definitions/isloginInfo"
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
   *
   *   isloginInfo:
   *     type: object
   *     properties:
   *       accessToken:
   *         type: "string"
   *       userNickname:
   *         type: "string"
   *       homeName:
   *         type: "string"
   */
  router.post(
    "/login",
    asyncRoute(async (req, res) => {
      const id = req.body.id;
      const password = req.body.password;
      console.log(req.body);
      const token = await loginService.isLogin(id, password);
      console.log(token);
      //토큰없으면 로그인 안된거니까 401로 에러출력하기
      if (token === null) {
        res.json({ message: "로그인실패 토큰이 없어요" });
        return;
      }
      //토큰으로 getUserId 하고 그 아이디를 바탕으로 집 정보 요청하기
      const userPk = token?.userPk;
      if (userPk === undefined) {
        res.json({ message: "userPk를 불러오지 못했어요" });
        return;
      }
      const userInfo = await userService.getUserInfo(userPk);

      if (userInfo?.HomeId === undefined || userInfo.HomeId === null) {
        res.json({
          accessToken: token?.accessToken,
          userNickname: userInfo?.nickname,
          homeName: "",
        });
        return;
      }
      const homeName = await homeService.getHomeInfo(userInfo.HomeId);
      res.json({
        accessToken: token?.accessToken,
        userNickname: userInfo?.nickname,
        homeName: homeName.name,
      });
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
