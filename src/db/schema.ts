import { Generated } from "kysely";

export interface DatabaseSchema {
  test: Test;
  user: User;
  Home: Home;
  TodoCategory: TodoCategory;
  Todo: Todo;
}

export interface Test {
  id: Generated<number>;
  key: string;
  value: string | null;
}

export interface User {
  user_pk: Generated<number>;
  user_id: string;
  password: string;
  HomeId?: number;
  name: string;
  gender?: string;
  nickname?: string;
}

export interface Home {
  home_id: Generated<number>;
  name: string;
  rentDate?: number;
  rentMonth?: number;
}

export interface TodoCategory {
  cateId: Generated<number>;
  name: string;
  homeId: number;
}
export interface Todo {
  todoId: Generated<number>;
  todoContent: string;
  date: string;
  cateId: number;
  userPk: number;
  isComplete: boolean;
}
