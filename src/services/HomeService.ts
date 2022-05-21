import { Database } from "../db";

export interface HomeService {
  getHomeInfo(id: number): Promise<HomeInfo>;
  postHomeInfo(Info: HomeInfo): Promise<number>;
  updateHomeInfo(homeId: number, Info: HomeInfo): Promise<bigint>;
  deleteHome(id: number): Promise<bigint>;
}

interface HomeServiceDeps {
  db: Database;
}
interface HomeInfo {
  Homeid: number;
  name: string;
  rentDate?: number;
  rentMonth?: number;
}
interface updateHomeInfo {
  name?: string;
  rentDate?: number;
  rentMonth?: number;
}

export function createHomeService({ db }: HomeServiceDeps): HomeService {
  return {
    async getHomeInfo(homeId) {
      const ret = await db
        .selectFrom("Home")
        .select(["home_id", "name", "rentDate", "rentMonth"])
        .where("home_id", "=", homeId)
        .execute();

      const curHomeInfo = {
        Homeid: ret[0].home_id,
        name: ret[0].name,
        rentDate: ret[0].rentDate,
        rentMonth: ret[0].rentMonth,
      };
      return curHomeInfo;
    },
    async postHomeInfo(Info: HomeInfo) {
      const info = Info;

      const postedHome = await db
        .insertInto("Home")
        .values({
          name: info.name,
          rentDate: info.rentDate,
          rentMonth: info.rentMonth,
        })
        .returning("home_id")
        .executeTakeFirstOrThrow();
      return postedHome.home_id;
    },
    async updateHomeInfo(homeId: number, Info: updateHomeInfo) {
      const updatedeRow = await db
        .updateTable("Home")
        .set({ name: Info.name, rentDate: Info.rentDate, rentMonth: Info.rentMonth })
        .where("home_id", "=", homeId)
        .executeTakeFirst();

      return updatedeRow.numUpdatedRows;
    },
    async deleteHome(id) {
      const deletedHome = await db.deleteFrom("Home").where("home_id", "=", id).executeTakeFirst();
      return deletedHome.numDeletedRows;
    },
  };
}
