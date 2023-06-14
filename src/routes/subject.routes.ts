import express from "express";
import { isAuth } from "../utils/auth.middleware";
import { subjectService } from "../domain/services/subject.service";

// Subject router
export const subjectRouter = express.Router();

subjectRouter.get("/", isAuth, subjectService.getSubjects);
subjectRouter.get("/:id", isAuth, subjectService.getSubjectById);
subjectRouter.post("/", isAuth, subjectService.createSubject);
subjectRouter.delete("/:id", isAuth, subjectService.deleteSubject);
subjectRouter.put("/:id", isAuth, subjectService.updateSubject);
