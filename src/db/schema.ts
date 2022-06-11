import { Generated } from "kysely";

export interface DatabaseSchema {
  test: Test;
  user: User;
  Home: Home;
  TodoCategory: TodoCategory;
  Todo: Todo;
  PastHome: PastHome;
  Rule: Rule;
  Rulecate: Rulecate;
}

export interface Test {
  id: Generated<number>;
  key: string;
  value: string | null;
}

export interface User {
  userPk: Generated<number>;
  userId: string;
  password: string;
  HomeId?: number;
  name: string;
  gender?: string;
  nickname?: string;
}

export interface Home {
  homeId: Generated<number>;
  name: string;
  rentDate?: number;
  rentMonth?: number;
}

export interface PastHome {
  userPk: number;
  homeId2: number;
  startDate: number;
  endDate: number;
}

export interface TodoCategory {
  cateId: Generated<number>;
  name: string;
  homeId: number;
}
export interface Todo {
  todoId: Generated<number>;
  todoContent: string;
  date: number;
  cateId: number | null;
  userPk: number;
  isCompleted: boolean;
}

export interface Rule {
  ruleId: Generated<number>;
  homeId: number;
  content: string;
  rulecateId: number | null;
}

export interface Rulecate {
  rulecateId: number;
  name: string;
}
