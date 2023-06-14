enum CUSTOM_ROLE {
  "STUDENT" = "STUDENT",
  "TEACHER" = "TEACHER",
  "PARENT" = "PARENT",
  "ADMIN" = "ADMIN",
}

declare namespace Express {
  export interface Request {
    user: {
      role: CUSTOM_ROLE;
      id: string;
    };
  }
}
