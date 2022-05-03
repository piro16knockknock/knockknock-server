import type { Database } from "../db";

export interface TestService {
  getValue(key: string): Promise<string | null>;
  setValue(key: string, value: string): Promise<void>;
}

interface TestServiceDeps {
  db: Database;
}

export function createTestService({ db }: TestServiceDeps): TestService {
  return {
    async getValue(key) {
      const ret = await db.selectFrom("test").select(["value"]).where("key", "=", key).execute();

      if (ret.length === 0) {
        return null;
      }

      return ret[0].value;
    },
    async setValue(key, value) {
      await db
        .insertInto("test")
        .values({
          key: key,
          value: value,
        })
        .execute();
    },
  };
}
