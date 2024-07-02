import { Router } from "express";
import * as companyController from "../controllers/company";
import checkAuthCompany from "../middlewares/checkAuth";

const companyRoute = Router();

companyRoute.get("/autologin", checkAuthCompany, companyController.AutoLogin);

companyRoute.post("/signup", companyController.SignUp);

companyRoute.post("/login", companyController.LogIn);

companyRoute.post("/imgurlupload", companyController.SaveCloudinaryUrl);

companyRoute.get("/imgurl/:id", companyController.getCloudinaryUrl);

companyRoute.post(
  "/update",
  checkAuthCompany,
  companyController.UpdateCompanyProfile
);

companyRoute.post("/verify-email/:token", companyController.VerifyEmail);

companyRoute.post("/send-password-link", companyController.SendPasswordLink);

companyRoute.post("/reset-password/:token", companyController.ChangePassword);

companyRoute.post("/logout", companyController.LogOut);

companyRoute.get("/:id", companyController.getCompany);

companyRoute.get("/", companyController.getAllCompanies);

export default companyRoute;
