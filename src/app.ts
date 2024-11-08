import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import fileUpload from "express-fileupload";
import express, { Request, Response } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import cors from "cors";
import companyRoute from "./routes/company";
import shiftRoute from "./routes/shift";
import staffRoute from "./routes/staff";
import notificationsRoute from "./routes/notifications";
import chatRoute from "./routes/chat";

// Testing commit

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 6000;

// Hello world

const origin =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

// middlewares
app.use(
  cors({
    origin,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// express session
const PostgresqlStore = connectPg(session);
const sessionStore = new PostgresqlStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
});

app.set("trust proxy", 1);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    // rolling: true,
    cookie: {
      maxAge: 60 * 60 * 1000 * 24 * 3, //3 days
      httpOnly: true,
      secure: process.env.NODE === "production",
      sameSite: process.env.NODE === "production" ? "none" : undefined,
    },
    store: sessionStore,
  })
);

// This is the Default Route of the API
app.get("/", async (req: Request, res: Response) => {
  res.json("Welcome to runshift API Backend");
});

app.use("/company", companyRoute);
app.use("/shifts", shiftRoute);
app.use("/staff", staffRoute);
app.use("/notifications", notificationsRoute);
app.use("/chats", chatRoute);

app.listen(PORT, () => {
  console.log(process.env.DATABASE_URL, "Database is online");

  console.log("Express server is running on port " + PORT);
});
