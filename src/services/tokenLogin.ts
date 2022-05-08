import express, { json } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    const tmp = (await loadPayload(tokenPayload)) as payloadInfo;
    console.dir(tmp.id);

    setUserId(req, tmp.id);
    next();
  };
}

//netstat -a -o
//taskkill /f /pid

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

interface payloadInfo {
  id: string;
}

interface WithUserInfo {
  user: {
    id: string;
    //name: string
  };
}

function setUserId(req: express.Request, userId: string) {
  (req as unknown as WithUserInfo).user = { id: userId };
}

export function getUserId(req: express.Request) {
  const user = (req as unknown as WithUserInfo).user;
  if (!user) {
    throw new Error("loginRequired() 없는데???");
  }
  return user.id;
}
