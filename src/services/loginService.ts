import type { Database } from "../db";

export interface LoginService {
  isLogin(id: string, password: string): Promise<string | null>;
  isJoin(id: string, password: string, name: string): Promise<bigint | null | undefined>;
}

interface loginServiceDeps {
  db: Database;
}

export function createLoginService({ db }: loginServiceDeps): LoginService {
  return {
    async isLogin(id, password) {
      const ret = await db
        .selectFrom("user")
        .select(["name"])
        .where("user_id", "=", id)
        .where("password", "=", password)
        .execute();

      if (ret.length === 0) {
        return null;
      }
      return ret[0].name;
    },
    async isJoin(id, password, name) {
      const ret = await db.insertInto("user").values({ user_id: id, password: password, name: name }).execute();

      if (ret.length === 0) {
        return null;
      }
      return ret[0].insertId;
    },
  };
}
