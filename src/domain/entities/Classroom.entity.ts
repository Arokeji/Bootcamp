import { Document, Schema, model } from "mongoose";

export interface IClassroomCreate {
  name: string;
}

export type IClassroom = IClassroomCreate & Document;

const classroomSchema = new Schema<IClassroomCreate>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minLength: [3, "⚠️ Classroom name needs to have at least 3 characters."]
    },
  },
  {
    timestamps: true,
  }
);

export const Classroom = model<IClassroomCreate>("Classroom", classroomSchema);
