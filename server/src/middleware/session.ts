import session from "express-session";
import MongoStore from "connect-mongo";
import { v4 as uuidv4 } from "uuid";
import type { RequestHandler } from "express";

export function sessionMiddleware() {
  const mongoUrl = process.env.MONGODB_URI;
  if (!mongoUrl) {
    throw new Error("MONGODB_URI is not set for session store");
  }
  const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
  const store = MongoStore.create({ mongoUrl });

  const sess = session({
    secret,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  });

  const ensureUserId: RequestHandler = (req, _res, next) => {
    if (!req.session.userId) {
      req.session.userId = uuidv4();
    }
    next();
  };

  return [sess, ensureUserId] as const;
}
