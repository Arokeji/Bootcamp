import { Request, Response, NextFunction } from "express";
import { subjectOdm } from "../odm/subject.odm";

export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS and 🎖️TEACHERS
    if (req.user.role !== "ADMIN" && req.user.role !== "TEACHER") {
      res.status(401).json({ error: "⛔ Only Admins and Teachers can perform this action." });
      return;
    }

    // Ternary that checks if there is any parameter and, if so, stores it
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const subjects = await subjectOdm.getAllSubjects(page, limit);

    // Total amount of elements found
    const totalElements = await subjectOdm.getSubjectCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: subjects,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjectIdToShow = req.params.id;

    // This action can only be performed by 🎖️ADMINS, 🎖️TEACHERS and the current subject
    if (req.user.role !== "ADMIN" && req.user.role !== "TEACHER") {
      res.status(401).json({ error: "⛔ Only Admins, Teachers can perform this action." });
      return;
    }

    const subject = await subjectOdm.getSubjectById(subjectIdToShow);

    if (subject) {
      const temporalSubject = subject.toObject();
      // TODO rellenar datos de clases y asignaturas
      res.json(temporalSubject);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const createdSubject = await subjectOdm.createSubject(req.body);
    res.status(201).json(createdSubject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const id = req.params.id;

    const subjectDeleted = await subjectOdm.deleteSubject(id);
    if (subjectDeleted) {
      res.json(subjectDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const id = req.params.id;

    const subjectToUpdate = await subjectOdm.getSubjectById(id);
    if (subjectToUpdate) {
      Object.assign(subjectToUpdate, req.body);
      const subjectSaved = await subjectToUpdate.save();
      res.json(subjectSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const subjectService = {
  getSubjects,
  getSubjectById,
  createSubject,
  deleteSubject,
  updateSubject,
};
