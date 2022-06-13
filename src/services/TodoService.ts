import { Database } from "../db";

export interface TodoService {
  getTodoList(userPk: number): Promise<todoList[]>;
  postTodo(userPk: number, todoInfo: todoList): Promise<number>;
  deleteTodo(todoId: number): Promise<number>;
  updateTodo(todoInfo: updateTodoList): Promise<number>;
  getTodouserPk(todoId: number): Promise<number | undefined>;
}

interface TodoServiceDeps {
  db: Database;
}

interface todoList {
  todoId?: number;
  todoContent: string;
  date: number;
  cateId?: number | null;
  isCompleted: boolean;
}

interface updateTodoList {
  todoId: number;
  todoContent?: string;
  date?: number;
  cateId?: number | null;
  userPk?: number;
  isCompleted?: boolean;
}

export function createTodoService({ db }: TodoServiceDeps): TodoService {
  return {
    //할일 등록, 목록조회, 수정 ,삭제
    //todo를 집에 귀속할건지 유저에 귀속할건지에 따라 매개변수 변경
    async getTodoList(userPk) {
      const ret = await db
        .selectFrom("Todo")
        .select(["todoId", "todoContent", "date", "cateId", "isCompleted"])
        .where("userPk", "=", userPk)
        .execute();

      const list: todoList[] = [];
      for (const s of ret) {
        const tmp: todoList = {
          todoId: s.todoId,
          todoContent: s.todoContent,
          date: s.date,
          cateId: s.cateId,
          isCompleted: s.isCompleted,
        };
        list.push(tmp);
      }

      return list;
    },
    async getTodouserPk(todoId) {
      const ret = await db.selectFrom("Todo").select("userPk").where("todoId", "=", todoId).execute();
      if (ret[0] == undefined) {
        return undefined;
      }
      return ret[0].userPk;
    },
    async postTodo(userPk, todoInfo) {
      if (todoInfo.cateId === 0 || todoInfo.cateId === undefined) {
        todoInfo.cateId = null;
      }
      const postTodoId = await db
        .insertInto("Todo")
        .values({
          todoContent: todoInfo.todoContent,
          date: todoInfo.date,
          cateId: todoInfo.cateId,
          userPk: userPk,
          isCompleted: todoInfo.isCompleted,
        })
        .executeTakeFirst();

      return Number(postTodoId.insertId);
    },
    async updateTodo(Info) {
      if (Info.cateId === 0 || Info.cateId === undefined) {
        Info.cateId = null;
      }
      const updatedeRow = await db
        .updateTable("Todo")
        .set({
          todoContent: Info.todoContent,
          date: Info.date,
          cateId: Info.cateId,
          isCompleted: Info.isCompleted,
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
