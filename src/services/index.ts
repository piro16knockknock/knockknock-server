import type { Database } from "../db";
import { createLoginService, LoginService } from "./loginService";
import { createTestService, TestService } from "./testService";

export interface Services {
  testService: TestService;
  loginService: LoginService;
}
interface CreateServiceDeps {
  db: Database;
}

export function createServices({ db }: CreateServiceDeps): Services {
  const testService = createTestService({ db });
  const loginService = createLoginService({ db });
  return {
    testService,
    loginService,
  };
}
