import { Router } from "express";
import * as getStaff from "../controllers/staff";

const staffRoute = Router();

staffRoute.get("/", getStaff.getStaff);

export default staffRoute;
