import { Classroom, IClassroom, IClassroomCreate } from "../entities/Classroom.entity";
import { Document } from "mongoose";

const getAllClassrooms = async (page: number, limit: number): Promise<IClassroom[]> => {
  return await Classroom.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getClassroomCount = async (): Promise<number> => {
  return await Classroom.countDocuments();
};

const getClassroomById = async (id: string): Promise<Document<IClassroom> | null> => {
  return await Classroom.findById(id);
};

const createClassroom = async (classroomData: IClassroomCreate): Promise<Document<IClassroom>> => {
  const classroom = new Classroom(classroomData);
  const document: Document<IClassroom> = (await classroom.save()) as any;
  return document;
};

const deleteClassroom = async (id: string): Promise<Document<IClassroom> | null> => {
  return await Classroom.findByIdAndDelete(id);
};

const updateClassroom = async (id: string, classroomData: any): Promise<Document<IClassroom> | null> => {
  return await Classroom.findByIdAndUpdate(id, classroomData, { new: true, runValidators: true });
};

export const classroomOdm = {
  getAllClassrooms,
  getClassroomCount,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
};
