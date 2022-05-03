import { Generated } from "kysely";

export interface DatabaseSchema {
  test: Test;
  user: User;
}

export interface Test {
  id: Generated<number>;
  key: string;
  value: string | null;
}

export interface User {
  id: Generated<number>;
}
