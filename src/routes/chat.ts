import { Router } from "express";
import * as chatController from "../controllers/chat";
// import checkAuthStaff from "../middlewares/checkAuthStaff";

const chatRoute = Router();

chatRoute.post("/create", chatController.createChat);
chatRoute.get("/post/:postId", chatController.getChatsByPost);
chatRoute.get("/:id", chatController.getChatById);
chatRoute.post("/delete/:id", chatController.deleteChat);

export default chatRoute;
