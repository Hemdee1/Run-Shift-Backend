import { Router } from "express";
import * as shiftController from "../controllers/shift";

const shiftRoute = Router();

shiftRoute.get("/:companyId", shiftController.getShifts);
shiftRoute.post("/addshift", shiftController.addShift);

export default shiftRoute;
