import { Database } from "../db";

export interface TodocateService {
  getTodocateList(homeId: number): Promise<todoCateList[]>;
  postTodocate(info: cateInfo): Promise<number>;
  deleteTodocate(cateId: number): Promise<number>;
  updateTodocate(cateId: number, info: cateInfo): Promise<number>;
}

interface TodocateServiceDeps {
  db: Database;
}

interface todoCateList {
  cateId: number;
  name: string;
}
interface cateInfo {
  name: string;
  homeId: number;
}
export function createTodocateService({ db }: TodocateServiceDeps): TodocateService {
  return {
    async getTodocateList(homeId) {
      const ret = await db.selectFrom("TodoCategory").select(["cateId", "name"]).where("homeId", "=", homeId).execute();

      const list: todoCateList[] = [];
      for (const s of ret) {
        const tmp: todoCateList = {
          cateId: s.cateId,
          name: s.name,
        };
        list.push(tmp);
      }
      return list;
    },
    async postTodocate(info) {
      const postTodocateId = await db
        .insertInto("TodoCategory")
        .values({
          name: info.name,
          homeId: info.homeId,
        })
        .executeTakeFirst();

      return Number(postTodocateId.insertId);
    },
    async updateTodocate(cateId, info) {
      const updateCateId = await db
        .updateTable("TodoCategory")
        .set({
          name: info.name,
          homeId: info.homeId,
        })
        .where("cateId", "=", cateId)
        .executeTakeFirst();

      return Number(updateCateId.numUpdatedRows);
    },
    async deleteTodocate(cateId) {
      const deleteCateId = await db.deleteFrom("TodoCategory").where("cateId", "=", cateId).executeTakeFirst();

      return Number(deleteCateId.numDeletedRows);
    },
  };
}
