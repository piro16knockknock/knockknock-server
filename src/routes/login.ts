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
      const name = loginService.isLogin(id, password);
      console.log(name);
      res.json({ message: `로그인 되었습니다` });
      return;
    }),
  ),
    router.post(
      "/join",
      asyncRoute(async (req, res) => {
        const id = req.body.id;
        const password = req.body.password;
        const name = req.body.name;
        const isLogin = loginService.isJoin(id, password, name);
        if (isLogin === null) {
          res.json({ message: `회원가입 실패` });
          return;
        }
        res.json({ message: `회원가입 성공` });
        return;
      }),
    );
  return router;
}
