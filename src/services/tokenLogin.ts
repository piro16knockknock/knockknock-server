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

    setUserId(req, userInfo);
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
  name: string;
}
export interface WithUserInfo {
  user: payloadInfo;
}

async function setUserId(req: express.Request, userInfo: payloadInfo) {
  (req as unknown as WithUserInfo).user = {
    userPk: userInfo.userPk,
    id: userInfo.id,
    name: userInfo.name,
  };
}

export function getUserId(req: express.Request) {
  const user = (req as unknown as WithUserInfo).user;
  if (!user) {
    throw new Error("loginRequired() 없는데???");
  }
  return user;
}
