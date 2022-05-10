import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PRIVATEKEY, SALTROUNDS } from "../const";
import type { Database } from "../db";

export interface LoginService {
  isLogin(id: string, password: string): Promise<string | null>;
  isJoin(
    id: string,
    password: string,
    name: string,
    gender: string,
    nickname: string,
  ): Promise<bigint | null | undefined>;
}

interface loginServiceDeps {
  db: Database;
}

export function createLoginService({ db }: loginServiceDeps): LoginService {
  return {
    async isLogin(id, password) {
      const ret = await db
        .selectFrom("user")
        .select(["name", "password", "gender", "nickname"])
        .where("user_id", "=", id)
        .execute();

      if (bcrypt.compareSync(password, ret[0].password)) {
        const payload = {
          tokenId: id,
          name: ret[0].name,
          gender: ret[0].gender,
          nickname: ret[0].nickname,
        };
        const accessToken = jwt.sign(payload, PRIVATEKEY);
        return accessToken;
      }
      return null;
    },
    async isJoin(id, password, name, gender, nickname) {
      const checkDuplicate = await db.selectFrom("user").select("user_id").where("user_id", "=", id).execute();

      if (checkDuplicate.length !== 0) {
        return null;
      }

      const hash = bcrypt.hashSync(password, SALTROUNDS);

      const ret = await db
        .insertInto("user")
        .values({ user_id: id, password: hash, name: name, gender: gender, nickname: nickname })
        .execute();

      return ret[0].insertId;
    },
  };
}
