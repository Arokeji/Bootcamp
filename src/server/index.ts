import express from "express";
import cors from "cors";
import { configureRoutes } from "../routes/index";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

// Server settings
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `http://localhost:${PORT as string}`,
  })
);

configureRoutes(app);
