import { Router } from "express";
import * as shiftController from "../controllers/shift";

const shiftRoute = Router();

shiftRoute.get("/company/:companyId", shiftController.getShifts);
shiftRoute.get("/date/:date", shiftController.getShiftsByDate);
shiftRoute.post("/addshift", shiftController.addShift);

export default shiftRoute;
