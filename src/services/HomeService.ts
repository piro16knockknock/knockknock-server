import { Database } from "../db";

export interface HomeService {
  getHomeInfo(id: number): Promise<HomeInfo>;
  postHomeInfo(Info: HomeInfo): Promise<number>;
  updateHomeInfo(homeId: number, Info: HomeInfo): Promise<number>;
  deleteHome(id: number): Promise<number>;
  // deleteHome(userPk: number): Promise<void>;
}

interface HomeServiceDeps {
  db: Database;
}
interface HomeInfo {
  HomeId?: number;
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
        .select(["homeId", "name", "rentDate", "rentMonth"])
        .where("homeId", "=", homeId)
        .execute();

      const curHomeInfo = {
        HomeId: ret[0].homeId,
        name: ret[0].name,
        rentDate: ret[0].rentDate,
        rentMonth: ret[0].rentMonth,
      };
      return curHomeInfo;
    },
    async postHomeInfo(info: HomeInfo) {
      const postedHome = await db
        .insertInto("Home")
        .values({
          name: info.name,
          rentDate: info.rentDate,
          rentMonth: info.rentMonth,
        })
        .executeTakeFirst();
      return Number(postedHome.insertId);
    },
    async updateHomeInfo(homeId: number, Info: updateHomeInfo) {
      const updatedeRow = await db
        .updateTable("Home")
        .set({ name: Info.name, rentDate: Info.rentDate, rentMonth: Info.rentMonth })
        .where("homeId", "=", homeId)
        .executeTakeFirst();

      return Number(updatedeRow.numUpdatedRows);
    },
    async deleteHome(id) {
      const deletedHome = await db.deleteFrom("Home").where("homeId", "=", id).executeTakeFirst();
      return Number(deletedHome.numDeletedRows);
    },
    /*
    async deleteHome (userPk) {
      await db.updateTable("user").where("userPk","=",userPk).set({HomeId: null})
    }
    */
  };
}
