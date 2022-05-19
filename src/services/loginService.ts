import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PRIVATEKEY, SALTROUNDS } from "../const";
import type { Database } from "../db";

export interface LoginService {
  isLogin(id: string, password: string): Promise<string | null>;
  isJoin(joinPayload: joinPayload): Promise<bigint | null | undefined>;
}

export interface joinPayload {
  id: string;
  password: string;
  name: string;
  gender?: string;
  nickname?: string;
}

interface loginServiceDeps {
  db: Database;
}

export function createLoginService({ db }: loginServiceDeps): LoginService {
  return {
    async isLogin(id, password) {
      const ret = await db
        .selectFrom("user")
        .select(["user_pk", "name", "password", "HomeId", "gender", "nickname"])
        .where("user_id", "=", id)
        .execute();

      if (bcrypt.compareSync(password, ret[0].password)) {
        const payload = {
          id: id,
          name: ret[0].name,
          HomeId: ret[0].HomeId,
          gender: ret[0].gender,
          nickname: ret[0].nickname,
        };
        const accessToken = jwt.sign(payload, PRIVATEKEY);
        return accessToken;
      }
      return null;
    },
    async isJoin(joinPayload) {
      const checkDuplicate = await db
        .selectFrom("user")
        .select("user_id")
        .where("user_id", "=", joinPayload.id)
        .execute();

      if (checkDuplicate.length !== 0) {
        return null;
      }

      const hash = bcrypt.hashSync(joinPayload.password, SALTROUNDS);

      const ret = await db
        .insertInto("user")
        .values({
          user_id: joinPayload.id,
          password: hash,
          name: joinPayload.name,
          gender: joinPayload.gender,
          nickname: joinPayload.nickname,
        })
        .execute();

      return ret[0].insertId;
    },
  };
}
