import { Database } from "../db";

export interface pastHomeService {
  getPastHomeList(userPk: number): Promise<listInfo[]>;
  postHomeInfo(userPk: number, Info: homeInfo): Promise<number>;
  deletepastHome(homeId: number): Promise<number>;
}
interface pastHomeServiceDeps {
  db: Database;
}
interface homeInfo {
  homeId2: number;
  startDate: number;
  endDate: number;
}

interface listInfo {
  homeId2: number;
  name?: string;
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

      const list: listInfo[] = [];
      for (const s of ret) {
        const name = await db.selectFrom("Home").select(["name"]).where("homeId", "=", s.homeId2).executeTakeFirst();

        const tmp = {
          homeId2: s.homeId2,
          name: name?.name,
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
    async deletepastHome(id) {
      const deletedHome = await db.deleteFrom("PastHome").where("homeId2", "=", id).executeTakeFirst();
      return Number(deletedHome.numDeletedRows);
    },
  };
}
