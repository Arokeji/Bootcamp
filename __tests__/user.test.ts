import { mongoConnect } from "../src/domain/repositories/mongo-repository";
import mongoose from "mongoose";
import { appInstance } from "../src/index";
import request from "supertest";
import { IUserCreate, ROLE, User } from "../src/domain/entities/User.entity";
import { app } from "../src/server";

describe("User controller", () => {
  const adminUserMock: IUserCreate = {
    email: "admin@gmail.com",
    password: "12345678",
    firstName: "ADMIN",
    lastName: "ISTRADOR",
    children: [],
    role: ROLE.ADMIN,
  };

  const teacherUserMock: IUserCreate = {
    email: "teacher1@gmail.com",
    password: "12345678",
    firstName: "Teacher",
    lastName: "One",
    children: [],
    role: ROLE.TEACHER,
  };

  let adminToken: string;
  let teacherToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    await new User(adminUserMock).save();
    await new User(teacherUserMock).save();
    console.log("Eliminados todos los usuarios");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    appInstance.close();
  });

  it("Is Jest working?", () => {
    expect(true).toBeTruthy();
  });

  it("POST /user/login - Credentials in login.", async () => {
    // Wrong credentials | Returns 401
    const wrongCredentials = { email: adminUserMock.email, password: "this is a wrong password" };
    const wrongResponse = await request(app).post("/user/login").send(wrongCredentials).expect(401);
    expect(wrongResponse.body.token).toBeUndefined();

    // Teacher logging OK | Returns 200
    const teacherCredentials = { email: teacherUserMock.email, password: teacherUserMock.password };
    const teacherResponse = await request(app).post("/user/login").send(teacherCredentials).expect(200);
    expect(teacherResponse.body.token).toBeDefined();
    teacherToken = teacherResponse.body.token;

    // Admin logging OK | Returns 200
    const adminCredentials = { email: adminUserMock.email, password: adminUserMock.password };
    const adminResponse = await request(app).post("/user/login").send(adminCredentials).expect(200);
    expect(adminResponse.body.token).toBeDefined();
    adminToken = adminResponse.body.token;
  });

  it("POST /user - Creating a user", async () => {
    const userToCreate: IUserCreate = {
      email: "student1@gmail.com",
      password: "12345678",
      firstName: "Student",
      lastName: "One",
      children: [],
      role: ROLE.STUDENT,
    };

    // Not logged | Returns 401
    await request(app).post("/user").send(userToCreate).expect(401);

    // Logged as Teacher | Returns 401
    await request(app).post("/user").set("Authorization", `Bearer ${teacherToken}`).send(userToCreate).expect(401);

    // Logged as Admin | Returns 201
    const response = await request(app).post("/user").set("Authorization", `Bearer ${adminToken}`).send(userToCreate).expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(userToCreate.email);

    createdUserId = response.body._id;
  });

  it("GET /user - Returning the users list.", async () => {
    // Not logged | Returns 401
    await request(app).get("/user").expect(401);

    // Logged as Teacher | Returns 200
    const teacherResponse = await request(app).get("/user").set("Authorization", `Bearer ${teacherToken}`).expect(200);
    expect(teacherResponse.body.data?.length).toBeDefined();

    // Logged as Admin | Returns 200
    const adminResponse = await request(app).get("/user").set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.data?.length).toBeDefined();

    // expect(response.body.data).toBeDefined();
    // expect(response.body.data.length).toBe(1);
    // expect(response.body.data[0].email).toBe(userMock.email);
    // expect(response.body.totalItems).toBe(1);
    // expect(response.body.totalPages).toBe(1);
    // expect(response.body.currentPage).toBe(1);
  });

  it("GET /user/:id - Returning a specific user.", async () => {
    // Not logged | Returns 401
    await request(app).get(`/user/${createdUserId}`).expect(401);

    // Logged as Teacher | Returns 200
    const teacherResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(200);
    expect(teacherResponse.body.firstName).toBeDefined();

    // Logged as Admin | Returns 200
    const adminResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBeDefined();
  });

  it("PUT /user/:id - Modifying a specific user", async () => {
    const updatedData = {
      firstName: "Updated",
      lastName: "Student",
    };

    // Not logged | Returns 401
    await request(app).put(`/user/${createdUserId}`).send(updatedData).expect(401);

    // Logged as Teacher | Returns 401
    await request(app).put(`/user/${createdUserId}`).send(updatedData).set("Authorization", `Bearer ${teacherToken}`).expect(401);

    // Logged as Admin | Returns 200
    const adminResponse = await request(app).put(`/user/${createdUserId}`).send(updatedData).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBe(updatedData.firstName);
    expect(adminResponse.body.lastName).toBe(updatedData.lastName);
  });

  it("DELETE /user/:id - Deleting a specific user", async () => {
    // Not logged | Returns 401
    await request(app).delete(`/user/${createdUserId}`).expect(401);

    // Logged as Teacher | Returns 401
    await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${teacherToken}`).expect(401);

    // Logged as Admin | Returns 200
    const adminResponse = await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body._id).toBe(createdUserId);
  });
});

//   it("PUT /user/id - Should not modify user when no token present", async () => {
//     const updatedData = {
//       lastName: "Cuadrado",
//     };

//     const response = await request(app).put(`/user/${userId}`).send(updatedData).expect(401);

//     expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
//   });

//   it("DELETE /user/id -  Do not delete user whe no token is present", async () => {
//     const response = await request(app).delete(`/user/${userId}`).expect(401);

//     expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
//   });

//   it("DELETE /user/id -  Deletes user when token is OK", async () => {
//     const response = await request(app).delete(`/user/${userId}`).set("Authorization", `Bearer ${token}`).expect(200);

//     expect(response.body._id).toBe(userId);
//   });
// });
