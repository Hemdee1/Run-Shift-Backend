import { Router } from "express";
import * as notificationsController from "../controllers/notification";

const notificationsRoute = Router();

notificationsRoute.get("/", notificationsController.getNotifications);
notificationsRoute.post("/addnotification", notificationsController.addNotification);

export default notificationsRoute;
