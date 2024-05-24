import { Router } from "express";
import * as shiftController from "../controllers/shift";

const shiftRoute = Router();

shiftRoute.get("/", shiftController.getShifts);

export default shiftRoute;
