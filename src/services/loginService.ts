import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PRIVATEKEY } from "../const";
import type { Database } from "../db";

const SALTROUNDS = 11;

export interface LoginService {
  isLogin(id: string, password: string): Promise<isLoginInfo | null>;
  isJoin(joinPayload: joinPayload): Promise<number | null>;
}

export interface joinPayload {
  id: string;
  password: string;
  name: string;
  gender?: string;
  nickname?: string;
}
export interface isLoginInfo {
  accessToken: string;
  userPk: number;
}

interface loginServiceDeps {
  db: Database;
}

export function createLoginService({ db }: loginServiceDeps): LoginService {
  return {
    async isLogin(id, password) {
      const ret = await db.selectFrom("user").select(["userPk", "name", "password"]).where("userId", "=", id).execute();
      if (ret.length === 0) {
        return null;
      }
      if (bcrypt.compareSync(password, ret[0].password)) {
        const payload = {
          userPk: ret[0].userPk,
          id: id,
          name: ret[0].name,
        };
        console.log(ret[0].userPk);
        const accessToken = jwt.sign(payload, PRIVATEKEY);
        const withAccessToken: isLoginInfo = {
          accessToken: accessToken,
          userPk: ret[0].userPk,
        };
        return withAccessToken;
      }
      return null;
    },
    async isJoin(joinPayload) {
      console.log(joinPayload);
      const checkDuplicate = await db
        .selectFrom("user")
        .select("userId")
        .where("userId", "=", joinPayload.id)
        .execute();

      if (checkDuplicate.length !== 0) {
        return null;
      }

      console.log(joinPayload.password, typeof joinPayload.password);

      const hash = bcrypt.hashSync(joinPayload.password, SALTROUNDS);

      const ret = await db
        .insertInto("user")
        .values({
          userId: joinPayload.id,
          password: hash,
          name: joinPayload.name,
          gender: joinPayload.gender,
          nickname: joinPayload.nickname,
        })
        .executeTakeFirst();

      return Number(ret.insertId);
    },
  };
}
