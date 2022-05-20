import type { Database } from "../db";
import { createHomeService, HomeService } from "./HomeService";
import { createLoginService, LoginService } from "./loginService";
import { createTestService, TestService } from "./testService";

export interface Services {
  testService: TestService;
  loginService: LoginService;
  homeService: HomeService;
}
interface CreateServiceDeps {
  db: Database;
}

export function createServices({ db }: CreateServiceDeps): Services {
  const testService = createTestService({ db });
  const loginService = createLoginService({ db });
  const homeService = createHomeService({ db });
  return {
    testService,
    loginService,
    homeService,
  };
}
