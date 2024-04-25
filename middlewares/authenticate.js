import jwt from "jsonwebtoken";
import { User } from "../model/index.js";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    req.user = null;
    next();
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      req.user = null;
      next();
    }

    req.user = user;
    next();
  } catch {
    req.user = null;
    next();
  }
};
