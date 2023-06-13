import { app } from "./server/index";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

export const appInstance = app.listen(PORT, () => {
  console.log(`❤️  Server live at port ${PORT as string} ❤️`);
});
