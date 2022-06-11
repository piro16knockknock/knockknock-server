import type { Database } from "../db";
import { createHomeService, HomeService } from "./HomeService";
import { createLoginService, LoginService } from "./loginService";
import { createPastHomeService, pastHomeService } from "./pastHomeService";
import { createRuleService, ruleService } from "./ruleService";
import { createTestService, TestService } from "./testService";
import { createTodoService, TodoService } from "./TodoService";
import { createUserService, UserService } from "./userService";

export interface Services {
  testService: TestService;
  loginService: LoginService;
  homeService: HomeService;
  UserService: UserService;
  TodoService: TodoService;
  pastHomeService: pastHomeService;
  ruleService: ruleService;
}
interface CreateServiceDeps {
  db: Database;
}

export function createServices({ db }: CreateServiceDeps): Services {
  const testService = createTestService({ db });
  const loginService = createLoginService({ db });
  const homeService = createHomeService({ db });
  const UserService = createUserService({ db });
  const TodoService = createTodoService({ db });
  const pastHomeService = createPastHomeService({ db });
  const ruleService = createRuleService({ db });
  return {
    testService,
    loginService,
    homeService,
    UserService,
    TodoService,
    pastHomeService,
    ruleService,
  };
}
