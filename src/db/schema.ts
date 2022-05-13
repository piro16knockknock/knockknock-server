import { Generated } from "kysely";

export interface DatabaseSchema {
  test: Test;
  user: User;
  Home: Home;
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
