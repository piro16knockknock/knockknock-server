import { Kysely, MysqlDialect } from "kysely";

import type { DatabaseSchema } from "./schema";

export type Database = Kysely<DatabaseSchema>;

export interface CreateDatabaseDeps {}

export function createDatabase({}: CreateDatabaseDeps): Database {
  const db = new Kysely<DatabaseSchema>({
    dialect: new MysqlDialect({
      host: "localhost",
      user: "root",
      password: "123",
      database: "knkn",
    }),
  });

  return db;
}
