import { Database } from "../db";

export interface TodoService {
  getTodoList(userPk: number): Promise<todoList>;
  postTodoList(): Promise<void>;
}

interface TodoServiceDeps {
  db: Database;
}

interface todoList {
  todoId: number;
  todoContent: string;
  date: string;
  cateId: number;
  userPk: number;
  isComplete: boolean;
}

export function createTodoService({ db }: TodoServiceDeps): TodoService {
  return {
    //할일 등록, 목록조회, 수정 ,삭제
    //todo를 집에 귀속할건지 유저에 귀속할건지에 따라 매개변수 변경
    async getTodoList(userPk) {
      const ret = await db
        .selectFrom("Todo")
        .select(["todoId", "todoContent", "date", "cateId", "userPk", "isComplete"])
        .where("userPk", "=", userPk)
        .execute();

      const List = {
        todoId: ret[0].todoId,
        todoContent: ret[0].todoContent,
        date: ret[0].date,
        cateId: ret[0].cateId,
        userPk: ret[0].userPk,
        isComplete: ret[0].isComplete,
      };

      return List;
    },
    async postTodoList() {
      return;
    },
  };
}
