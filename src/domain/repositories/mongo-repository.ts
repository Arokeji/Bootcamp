// Importing libraries and ENVIRONMENT VARIABLES
import { Mongoose, connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_CONNECTION: string = process.env.DB_CONNECTION as string;
const DB_NAME: string = process.env.DB_NAME as string;

// Mongo connection settings
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

export const mongoConnect = async (): Promise<Mongoose | null> => {
  try {
    const database: Mongoose = await connect(DB_CONNECTION, config);
    const { name, host } = database.connection;
    console.log(`🔌 Connected to ${name} at ${host} ✅`);

    return database;
  } catch (error) {
    console.error(error);
    console.log("🔌 Error connecting. Trying to connect again in 5 seconds. ❌");
    setTimeout(mongoConnect, 5000);

    return null;
  }
};
