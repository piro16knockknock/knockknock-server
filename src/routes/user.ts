import express from "express";

import { getUserInfo, loginRequired } from "../services/tokenLogin";

export function createUserRoute() {
  const router = express.Router();

  router.get("/", loginRequired(), (req, res) => {
    const userInfo = getUserInfo(req);

    res.json({
      message: "hello world!",
      userInfo,
    });
  });

  return router;
}
