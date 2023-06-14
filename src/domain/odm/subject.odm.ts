import { Subject, ISubject, ISubjectCreate } from "../entities/Subject.entity";
import { Document } from "mongoose";

const getAllSubjects = async (page: number, limit: number): Promise<ISubject[]> => {
  return await Subject.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .populate(["classroom", "teacher"]);
};

const getSubjectCount = async (): Promise<number> => {
  return await Subject.countDocuments();
};

const getSubjectById = async (id: string): Promise<Document<ISubject> | null> => {
  return await Subject.findById(id).populate(["classroom", "teacher"]);
};

const getSubjectsByClassroomId = async (classroomId: string): Promise<ISubject[]> => {
  return await Subject.find({ classroom: classroomId });
};

const createSubject = async (subjectData: ISubjectCreate): Promise<Document<ISubject>> => {
  const subject = new Subject(subjectData);
  const document: Document<ISubject> = (await subject.save()) as any;
  return document;
};

const deleteSubject = async (id: string): Promise<Document<ISubject> | null> => {
  return await Subject.findByIdAndDelete(id);
};

const updateSubject = async (id: string, subjectData: any): Promise<Document<ISubject> | null> => {
  return await Subject.findByIdAndUpdate(id, subjectData, { new: true, runValidators: true });
};

export const subjectOdm = {
  getAllSubjects,
  getSubjectCount,
  getSubjectById,
  getSubjectsByClassroomId,
  createSubject,
  deleteSubject,
  updateSubject,
};
