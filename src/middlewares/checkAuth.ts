import { RequestHandler } from "express";

const checkAuthUser: RequestHandler = async (req, res, next) => {
  const id = req.session.id;

  if (!id) {
    return res.status(401).json("Unauthorized");
  } else {
    next();
  }
};

export default checkAuthUser;
