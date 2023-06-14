import { Request, Response, NextFunction } from "express";
import { classroomOdm } from "../odm/classroom.odm";

export const getClassrooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS and 🎖️TEACHERS
    if (req.user.role !== "ADMIN" && req.user.role !== "TEACHER") {
      res.status(401).json({ error: "⛔ Only Admins and Teachers can perform this action." });
      return;
    }

    // Ternary that checks if there is any parameter and, if so, stores it
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const classrooms = await classroomOdm.getAllClassrooms(page, limit);

    // Total amount of elements found
    const totalElements = await classroomOdm.getClassroomCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: classrooms,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getClassroomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classroomIdToShow = req.params.id;

    // This action can only be performed by 🎖️ADMINS, 🎖️TEACHERS and the current classroom
    if (req.user.role !== "ADMIN" && req.user.role !== "TEACHER") {
      res.status(401).json({ error: "⛔ Only Admins, Teachers can perform this action." });
      return;
    }

    const classroom = await classroomOdm.getClassroomById(classroomIdToShow);

    if (classroom) {
      const temporalClassroom = classroom.toObject();
      // TODO rellenar datos de clases y asignaturas
      res.json(temporalClassroom);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const createdClassroom = await classroomOdm.createClassroom(req.body);
    res.status(201).json(createdClassroom);
  } catch (error) {
    next(error);
  }
};

export const deleteClassroom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const id = req.params.id;

    const classroomDeleted = await classroomOdm.deleteClassroom(id);
    if (classroomDeleted) {
      res.json(classroomDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateClassroom = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const id = req.params.id;

    const classroomToUpdate = await classroomOdm.getClassroomById(id);
    if (classroomToUpdate) {
      Object.assign(classroomToUpdate, req.body);
      const classroomSaved = await classroomToUpdate.save();
      res.json(classroomSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const classroomService = {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
