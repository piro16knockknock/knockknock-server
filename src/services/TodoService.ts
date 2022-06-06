import { Database } from "../db";

export interface TodoService {
  getTodoList(userPk: number): Promise<todoList[]>;
  postTodo(todoInfo: todoList): Promise<number>;
  deleteTodo(todoId: number): Promise<number>;
  updateTodo(todoInfo: updateTodoList): Promise<number>;
}

interface TodoServiceDeps {
  db: Database;
}

interface todoList {
  todoId?: number;
  todoContent: string;
  date: number;
  cateId: number;
  userPk: number;
  isComplete: boolean;
}

interface updateTodoList {
  todoId: number;
  todoContent?: string;
  date?: number;
  cateId?: number;
  userPk?: number;
  isComplete?: boolean;
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

      const list: todoList[] = [];
      for (const s of ret) {
        const tmp = {
          todoId: s.todoId,
          todoContent: s.todoContent,
          date: s.date,
          cateId: s.cateId,
          userPk: s.userPk,
          isComplete: s.isComplete,
        };
        list.push(tmp);
      }

      return list;
    },
    async postTodo(todoInfo) {
      const postTodoId = await db
        .insertInto("Todo")
        .values({
          todoContent: todoInfo.todoContent,
          date: todoInfo.date,
          cateId: todoInfo.cateId,
          userPk: todoInfo.userPk,
          isComplete: todoInfo.isComplete,
        })
        .returning("todoId")
        .executeTakeFirstOrThrow();
      return postTodoId.todoId;
    },
    async updateTodo(Info) {
      const updatedeRow = await db
        .updateTable("Todo")
        .set({
          todoContent: Info.todoContent,
          date: Info.date,
          cateId: Info.cateId,
          userPk: Info.userPk,
          isComplete: Info.isComplete,
        })
        .where("todoId", "=", Info.todoId)
        .executeTakeFirst();

      return Number(updatedeRow.numUpdatedRows);
    },
    async deleteTodo(todoId) {
      const deleteTodo = await db.deleteFrom("Todo").where("todoId", "=", todoId).executeTakeFirst();
      return Number(deleteTodo.numDeletedRows);
    },
  };
}
