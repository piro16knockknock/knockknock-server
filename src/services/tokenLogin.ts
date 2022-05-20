import express from "express";
import jwt from "jsonwebtoken";

import { PRIVATEKEY } from "../const";

export function loginRequired() {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      res.status(401).json({ message: "토큰이 없어요?" });
      return;
    }

    const decoded = tokenLogin(accessToken);
    // 토큰 검증
    if (!decoded) {
      res.status(401).json({ message: "로그인 필요한데?" });
      return;
    }

    const tokenPayload = jwt.decode(accessToken, { complete: true })?.payload;
    const userInfo = (await loadPayload(tokenPayload)) as payloadInfo;
    console.dir(userInfo.id);

    setUserInfo(req, userInfo);
    next();
  };
}

//netstat -a -o    모든포트 보기
//taskkill /f /pid (번호)   포트 죽이기

async function loadPayload(tokenPayload: string | jwt.JwtPayload | undefined) {
  if (tokenPayload === "undefined") {
    return;
  }
  return tokenPayload;
}

async function tokenLogin(accessToken: string) {
  const decoded = jwt.verify(accessToken, PRIVATEKEY);
  if (decoded) {
    return decoded;
  }
  return null;
}

export interface payloadInfo {
  userPk: number;
  id: string;
  HomeId?: number;
  name: string;
  gender?: string;
  nickname?: string;
}
export interface WithUserInfo {
  user: payloadInfo;
}

function setUserInfo(req: express.Request, userInfo: payloadInfo) {
  (req as unknown as WithUserInfo).user = {
    userPk: userInfo.userPk,
    id: userInfo.id,
    HomeId: userInfo.HomeId,
    name: userInfo.name,
    gender: userInfo.gender,
    nickname: userInfo.nickname,
  };
}

export function getUserInfo(req: express.Request) {
  const user = (req as unknown as WithUserInfo).user;
  if (!user) {
    throw new Error("loginRequired() 없는데???");
  }
  return user;
}
