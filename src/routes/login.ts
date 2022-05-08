import express from "express";

import { LoginService } from "../services/loginService";
import { asyncRoute } from "../utils/route";

export interface CreateLoginRouteDeps {
  loginService: LoginService;
}

export function createLoginRoute({ loginService }: CreateLoginRouteDeps) {
  const router = express.Router();

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
        const isJoin = loginService.isJoin(id, password, name);
        if (isJoin === null) {
          res.json({ message: `회원가입 실패 중복 아이디가 존재합니다.` });
          return;
        }
        res.json({ message: `회원가입 성공` });
        return;
      }),
    );
  return router;
}