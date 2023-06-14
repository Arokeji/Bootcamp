import { Document, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export enum ROLE {
  "STUDENT" = "STUDENT",
  "TEACHER" = "TEACHER",
  "PARENT" = "PARENT",
  "ADMIN" = "ADMIN",
}

export interface IUserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // classroom?: IClassroom;
  children: IUser[];
  role: ROLE;
}

export type IUser = IUserCreate & Document;

const userSchema = new Schema<IUserCreate>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "Not a valid email.",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 4,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      minLength: 2,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 2,
      required: true,
    },
    // classroom?: IClassroom;
    children: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ROLE,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    // If password was already modified it won't do it again
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = model<IUserCreate>("User", userSchema);
