import { Kysely, MysqlDialect } from "kysely";

import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from "../const";
import type { DatabaseSchema } from "./schema";

export type Database = Kysely<DatabaseSchema>;

export function createDatabase(): Database {
  const db = new Kysely<DatabaseSchema>({
    dialect: new MysqlDialect({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    }),
  });

  return db;
}
