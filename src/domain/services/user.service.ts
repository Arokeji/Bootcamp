import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/token";
import { userOdm } from "../odm/user.odm";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS and 🎖️TEACHERS
    if (req.user.role !== "ADMIN" && req.user.role !== "TEACHER") {
      res.status(401).json({ error: "⛔ Only Admins and Teachers can perform this action." });
      return;
    }

    // Ternary that checks if there is any parameter and, if so, stores it
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const users = await userOdm.getAllUsers(page, limit);

    // Total amount of elements found
    const totalElements = await userOdm.getUserCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;

    // This action can only be performed by 🎖️ADMINS, 🎖️TEACHERS and the current user
    if (req.user.role !== "ADMIN" && req.user.role !== "TEACHER" && req.user.id !== userIdToShow) {
      res.status(401).json({ error: "⛔ Only Admins, Teachers and the logged user can perform this action." });
      return;
    }

    const user = await userOdm.getUserById(userIdToShow);

    if (user) {
      const temporalUser = user.toObject();

      res.json(temporalUser);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const createdUser = await userOdm.createUser(req.body);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const id = req.params.id;

    const userDeleted = await userOdm.deleteUser(id);
    if (userDeleted) {
      res.json(userDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This action can only be performed by 🎖️ADMINS
    if (req.user.role !== "ADMIN") {
      res.status(401).json({ error: "⛔ Only Admins can perform this action." });
      return;
    }

    const id = req.params.id;

    const userToUpdate = await userOdm.getUserById(id);
    if (userToUpdate) {
      Object.assign(userToUpdate, req.body);
      await userToUpdate.save();
      // Putting out password from the response
      const userToSend: any = userToUpdate.toObject();
      delete userToSend.password;
      res.json(userToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "🫙 You must specify an user and a password." });
      return;
    }

    const user: any = await userOdm.getUserByEmailWithPassword(email);
    if (!user) {
      res.status(401).json({ error: "🚫 Wrong user or password." });
      return;
    }

    // Checks password
    const userPassword: string = user.password;
    const match = await bcrypt.compare(password, userPassword);

    if (!match) {
      res.status(401).json({ error: "🚫 Wrong user or password." });
      return;
    }

    // Generates token JWT
    const jwtToken = generateToken(user._id.toString(), user.email);

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    next(error);
  }
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  login,
};
