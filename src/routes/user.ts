import express from "express";

import { getUserId, loginRequired } from "../services/tokenLogin";

export function createUserRoute() {
  const router = express.Router();

  router.get("/", loginRequired(), (req, res) => {
    const userId = getUserId(req);

    res.json({
      message: "hello world!",
    });
  });

  return router;
}
