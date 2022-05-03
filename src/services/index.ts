import type { Database } from "../db";
import { createTestService, TestService } from "./testService";

export interface Services {
  testService: TestService;
}

interface CreateServiceDeps {
  db: Database;
}

export function createServices({ db }: CreateServiceDeps): Services {
  const testService = createTestService({ db });

  return {
    testService,
  };
}
