import type { Database } from "../db";

export interface UserService {
  getUserInfo(userPk: number): Promise<UserInfo | null>;
  setUserInfo(userPk: number, value: UserInfo): Promise<void>;
}

interface UserServiceDeps {
  db: Database;
}
interface UserInfo {
  HomeId?: number;
  gender?: string;
  nickname?: string;
}

export function createUserService({ db }: UserServiceDeps): UserService {
  return {
    async getUserInfo(userPk) {
      const ret = await db
        .selectFrom("user")
        .select(["name", "HomeId", "gender", "nickname"])
        .where("user_pk", "=", userPk)
        .execute();

      if (ret.length === 0) {
        return null;
      }
      const user: UserInfo = {
        HomeId: ret[0].HomeId,
        gender: ret[0].gender,
        nickname: ret[0].nickname,
      };
      return user;
    },
    async setUserInfo(userPk, info: UserInfo) {
      await db
        .updateTable("user")
        .set({
          HomeId: info.HomeId,
          gender: info.gender,
          nickname: info.nickname,
        })
        .where("user_pk", "=", userPk)
        .executeTakeFirst();
    },
  };
}