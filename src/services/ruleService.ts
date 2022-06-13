import { Database } from "../db";

export interface ruleService {
  getRuleList(homeId: number): Promise<ruleInfo[]>;
  getRuleInfo(ruleId: number): Promise<number>;
  postRule(homeId: number, info: postruleInfo): Promise<number>;
  updateRule(info: updateRuleInfo): Promise<number>;
  deleteRule(ruleId: number): Promise<number>;
}

interface ruleServiceDeps {
  db: Database;
}

export interface ruleInfo {
  ruleId?: number;
  homeId: number;
  content: string;
  rulecateId?: number | null;
}

export interface postruleInfo {
  content: string;
  rulecateId?: number | null;
}

export interface updateRuleInfo {
  ruleId: number;
  content?: string;
  rulecateId?: number | null;
}

export function createRuleService({ db }: ruleServiceDeps): ruleService {
  return {
    async getRuleList(homeId) {
      const ret = await db
        .selectFrom("Rule")
        .select(["ruleId", "homeId", "content", "rulecateId"])
        .where("homeId", "=", homeId)
        .execute();

      const list: ruleInfo[] = [];
      for (const s of ret) {
        const tmp: ruleInfo = {
          ruleId: s.ruleId,
          homeId: s.homeId,
          content: s.content,
          rulecateId: s.rulecateId,
        };
        list.push(tmp);
      }
      return list;
    },
    async getRuleInfo(ruleId) {
      const ret = await db.selectFrom("Rule").select(["homeId"]).where("ruleId", "=", ruleId).execute();

      return ret[0].homeId;
    },
    async postRule(homeId, info) {
      if (info.rulecateId === 0 || info.rulecateId === undefined) {
        info.rulecateId = null;
      }
      const postRuleId = await db
        .insertInto("Rule")
        .values({
          homeId: homeId,
          content: info.content,
          rulecateId: info.rulecateId,
        })
        .executeTakeFirst();

      return Number(postRuleId.insertId);
    },
    async updateRule(info) {
      if (info.rulecateId === 0 || info.rulecateId === undefined) {
        info.rulecateId = null;
      }

      const updatedRow = await db
        .updateTable("Rule")
        .set({
          content: info.content,
          rulecateId: info.rulecateId,
        })
        .where("ruleId", "=", info.ruleId)
        .executeTakeFirst();
      return Number(updatedRow.numUpdatedRows);
    },
    async deleteRule(ruleId) {
      const deletedRule = await db.deleteFrom("Rule").where("ruleId", "=", ruleId).executeTakeFirst();
      return Number(deletedRule.numDeletedRows);
    },
  };
}
