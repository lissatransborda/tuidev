const request = require("supertest");
import { app } from "../../src/app";
import { User } from "../entities/User";

describe("test user create", () => {
  test("It should response the POST method with the created user", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    expect(newUser.body).toHaveProperty("id");
    expect(newUser.body).toHaveProperty("username", randomUser);
    expect(newUser.body).toHaveProperty("name", "test_name");
  });

  test("It should response the POST method with an Bad Request, saying the user alredy exists", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const user = {
      username: randomUser,
      password: "test_password",
      name: "test_name",
    };
    await request(app).post("/user").send(user);
    const newUser = await request(app).post("/user").send(user);

    expect(newUser.status).toEqual(400);
    expect(newUser.body).toHaveProperty("data");
  });
});

describe("Test user getAll", () => {
  test("It should response the GET method with a list of users", async () => {
    const users = await request(app).get("/user");

    if (users.body.length > 0) {
      users.body.forEach((user: User) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("name");
      });
    } else {
      expect(users.body).toEqual([]);
    }
  });
});

describe("Test user getByUsername", () => {
  test("It should response the GET method with one user", async () => {
    const users = await request(app).get("/user");

    const user = await request(app).get(`/user/${users.body[0].username}`);

    expect(user.body).toHaveProperty("id");
    expect(user.body).toHaveProperty("username");
    expect(user.body).toHaveProperty("name");
    expect(user.body).toHaveProperty("articles");
  });
});
