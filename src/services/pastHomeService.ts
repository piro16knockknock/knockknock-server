import { Database } from "../db";

export interface pastHomeService {
  getPastHomeList(userPk: number): Promise<homeInfo[]>;
  postHomeInfo(userPk: number, Info: homeInfo): Promise<number>;
  deleteHome(homeId: number): Promise<number>;
}
interface pastHomeServiceDeps {
  db: Database;
}
interface homeInfo {
  homeId2: number;
  startDate: number;
  endDate: number;
}

export function createPastHomeService({ db }: pastHomeServiceDeps): pastHomeService {
  return {
    async getPastHomeList(userPk) {
      const ret = await db
        .selectFrom("PastHome")
        .select(["homeId2", "startDate", "endDate"])
        .where("userPk", "=", userPk)
        .execute();

      const list: homeInfo[] = [];
      for (const s of ret) {
        const tmp = {
          homeId2: s.homeId2,
          startDate: s.startDate,
          endDate: s.endDate,
        };
        list.push(tmp);
      }
      return list;
    },
    async postHomeInfo(userPk, info) {
      const postedHome = await db
        .insertInto("PastHome")
        .values({
          userPk: userPk,
          homeId2: info.homeId2,
          startDate: info.startDate,
          endDate: info.endDate,
        })
        .executeTakeFirst();
      return Number(postedHome.insertId);
    },
    async deleteHome(id) {
      const deletedHome = await db.deleteFrom("PastHome").where("homeId2", "=", id).executeTakeFirst();
      return Number(deletedHome.numDeletedRows);
    },
  };
}
