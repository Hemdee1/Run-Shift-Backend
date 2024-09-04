import { Router } from "express";
import * as staffController from "../controllers/staff";

const staffRoute = Router();

// staffRoute.get("/", getStaff.getStaff);
staffRoute.get('/:companyId', staffController.getCompanyStaff);
staffRoute.post("/addstaff", staffController.AddStaff);


export default staffRoute;
