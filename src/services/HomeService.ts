import { Database } from "../db";

export interface HomeService {
  getHomeInfo(id: number): Promise<HomeInfo>;
  postHomeInfo(Info: HomeInfo): Promise<number>;
  updateHomeInfo(homeId: number, Info: HomeInfo): Promise<number>;
  deleteHome(id: number): Promise<number>;
}

interface HomeServiceDeps {
  db: Database;
}
interface HomeInfo {
  Homeid?: number;
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
        .select(["home_id", "name", "rent_date", "rent_month"])
        .where("home_id", "=", homeId)
        .execute();

      const curHomeInfo = {
        Homeid: ret[0].home_id,
        name: ret[0].name,
        rentDate: ret[0].rent_date,
        rentMonth: ret[0].rent_month,
      };
      return curHomeInfo;
    },
    async postHomeInfo(info: HomeInfo) {
      const postedHome = await db
        .insertInto("Home")

        .values({
          name: info.name,
          rent_date: info.rentDate,
          rent_month: info.rentMonth,
        })
        .executeTakeFirst();
      return Number(postedHome.insertId);
    },
    async updateHomeInfo(homeId: number, Info: updateHomeInfo) {
      const updatedeRow = await db
        .updateTable("Home")
        .set({ name: Info.name, rent_date: Info.rentDate, rent_month: Info.rentMonth })
        .where("home_id", "=", homeId)
        .executeTakeFirst();

      return Number(updatedeRow.numUpdatedRows);
    },
    async deleteHome(id) {
      const deletedHome = await db.deleteFrom("Home").where("home_id", "=", id).executeTakeFirst();
      return Number(deletedHome.numDeletedRows);
    },
  };
}
