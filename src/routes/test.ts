import express from "express";
import { TestService } from "../services/testService";
import { asyncRoute } from "../utils/route";

export interface CreateTestRouteDeps {
  testService: TestService;
}

export function createTestRoute({ testService }: CreateTestRouteDeps) {
  const router = express.Router();

  router.get(
    "/:key",
    asyncRoute(async (req, res) => {
      const key = req.params.key as unknown;

      if (!(typeof key === "string")) {
        res.status(400).json({
          message: "key값이 없는데?",
        });
        return;
      }

      const value = await testService.getValue(key);

      res.json({
        message: "helloworld",
        value: value,
      });
    }),
  );

  return router;
}
