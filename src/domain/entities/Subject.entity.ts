import { Document, Schema, model } from "mongoose";
import { IClassroom } from "./Classroom.entity";
import { IUser } from "./User.entity";

export interface ISubjectCreate {
  name: string;
  classroom: IClassroom;
  teacher: IUser;
}

export type ISubject = ISubjectCreate & Document;

const subjectSchema = new Schema<ISubjectCreate>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minLength: [3, "⚠️ Subject name needs to have at least 3 characters."],
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subject = model<ISubjectCreate>("Subject", subjectSchema);
