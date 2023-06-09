require("dotenv").config();
const jwt = require("jsonwebtoken");
const request = require("supertest");

import { app } from "../../src/app";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

describe("test login", () => {
  test("It should response the POST method with the JWT", async () => {
    const randomUser = `test_username_${Math.random()}`;
    await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    expect(jwtData.status).toBe(200);

    const result = await jwt.verify(jwtData.body.data, JWT_PRIVATE_KEY);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("username");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("iat");
  });

  test("It should response the POST method with a Bad Request by wrong credentials", async () => {
    const randomUser = `test_username_${Math.random()}`;
    await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: "wrong_user",
      password: "wrong_password",
    });

    expect(jwtData.status).toBe(400);
  });

  test("It should response the POST method with a Bad Request by wrong validation", async () => {
    const randomUser = `test_username_${Math.random()}`;
    await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const requestData = await request(app).post("/login").send({
      username: "wrong_user",
    });

    expect(requestData.status).toEqual(400);
    expect(requestData.body).toHaveProperty("errors");
  });
});
