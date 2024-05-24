import { Router } from "express";
import * as testController from "../controllers/company";
import checkAuthCompany from "../middlewares/checkAuth";

const testRoute = Router();



testRoute.post("/login", testController.testLogin);

// companyRoute.post(
//   "/update",
//   checkAuthCompany,
//   companyController.UpdateCompanyProfile
// );

// companyRoute.post("/verify-email/:token", companyController.VerifyEmail);

// companyRoute.post("/send-password-link", companyController.SendPasswordLink);

// companyRoute.post("/reset-password/:token", companyController.ChangePassword);

// companyRoute.post("/logout", companyController.LogOut);

// companyRoute.get("/:id", companyController.getCompany);

// companyRoute.get("/", companyController.getAllCompanies);

export default testRoute;
