import { User, IUser, IUserCreate } from "../entities/User.entity";
import { Document } from "mongoose";

const getAllUsers = async (page: number, limit: number): Promise<IUser[]> => {
  return await User.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getUserCount = async (): Promise<number> => {
  return await User.countDocuments();
};

const getUserById = async (id: string): Promise<Document<IUser> | null> => {
  return await User.findById(id).populate(["children"]);
};

const getUserByEmailWithPassword = async (email: string): Promise<Document<IUser> | null> => {
  const user: Document<IUser> | null = await User.findOne({ email }).select("+password") as any;
  return user;
};

const getStudentsByClassroomId = async (classroomId: string): Promise<IUser[]> => {
  return await User.find({ classroom: classroomId });
};

const createUser = async (userData: IUserCreate): Promise<Document<IUser>> => {
  const user = new User(userData);
  const document: Document<IUser> = (await user.save()) as any;
  const userWithoutPassword = document.toObject();
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

const deleteUser = async (id: string): Promise<Document<IUser> | null> => {
  return await User.findByIdAndDelete(id);
};

const updateUser = async (id: string, userData: any): Promise<Document<IUser> | null> => {
  return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
};

export const userOdm = {
  getAllUsers,
  getUserCount,
  getUserById,
  getUserByEmailWithPassword,
  getStudentsByClassroomId,
  createUser,
  deleteUser,
  updateUser,
};
