import express from "express";

export function createUserRoute() {
  const router = express.Router();

  router.get("/", (_req, res) => {
    res.json({
      message: "hello world!",
    });
  });

  return router;
}
