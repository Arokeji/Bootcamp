import express, { type NextFunction, type Response, type Request, type ErrorRequestHandler } from "express";

export const configureRoutes = (app: any): any => {
  // Main route
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h1>🏫 School Management API 🚸</h1>
    `);
  });

  // No route
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("🫥 The specified route doesn't exist.");
  });

  // Routes set
  app.use("/public", express.static("public"));
  app.use("/", router);

  // Middleware de gestión de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("🚩🚩🚩 ERROR LOG STARTS 🚩🚩🚩");
    console.log(`🔗‍💥 Request failed: ${req.method} to ${req.originalUrl}`);
    console.log(err);
    console.log("🏴🏴🏴 ERROR LOG ENDS 🏴🏴🏴");

    // Truco para quitar el tipo a una variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(400).json({ error: errorAsAny?.sqlMessage });
    } else {
      res.status(500).json(err);
    }
  });

  return app;
};
