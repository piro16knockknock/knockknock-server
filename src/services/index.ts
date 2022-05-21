import type { Database } from "../db";
import { createHomeService, HomeService } from "./HomeService";
import { createLoginService, LoginService } from "./loginService";
import { createTestService, TestService } from "./testService";
import { createUserService, UserService } from "./userService";

export interface Services {
  testService: TestService;
  loginService: LoginService;
  homeService: HomeService;
  UserService: UserService;
}
interface CreateServiceDeps {
  db: Database;
}

export function createServices({ db }: CreateServiceDeps): Services {
  const testService = createTestService({ db });
  const loginService = createLoginService({ db });
  const homeService = createHomeService({ db });
  const UserService = createUserService({ db });
  return {
    testService,
    loginService,
    homeService,
    UserService,
  };
}
