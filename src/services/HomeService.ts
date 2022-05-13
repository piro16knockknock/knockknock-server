import { Database } from "../db";

export interface HomeService {
  getHomeInfo(id: number): Promise<HomeInfo>;
  postHomeInfo(Info: HomeInfo): Promise<number>;
  updateHomeInfo(Info: HomeInfo): Promise<void>;
}

interface HomeServiceDeps {
  db: Database;
}
interface HomeInfo {
  name: string;
  rentDate?: number;
  rentMonth?: number;
}

export function createHomeService({ db }: HomeServiceDeps): HomeService {
  return {
    async getHomeInfo(id) {
      const ret = await db
        .selectFrom("Home")
        .select(["name", "rentDate", "rentMonth"])
        .where("home_id", "=", id)
        .execute();

      const curHomeInfo = {
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
    async updateHomeInfo(Info: HomeInfo) {
      const info = Info;

      const updatedeRow = await db
        .updateTable("Home")
        .set({ name: info.name, rentDate: info.rentDate, rentMonth: info.rentMonth })
        .where("Home.name", "=", Info.name)
        .executeTakeFirst();
      console.log(`${updatedeRow} 번째 row가 변경 되었습니다.`);
      return;
    },
  };
}
