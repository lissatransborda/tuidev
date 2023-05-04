const request = require("supertest");
import { app } from "../../src/app";
import { User } from "../entities/User";
import { v4 as uuidv4 } from "uuid";

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

  test("It should response the POST method with an Bad Requesta by the user alredy exists", async () => {
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

  test("It should response the POST method with an Bad Request by wrong validation", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const user = {
      password: "test_password",
    };
    const newUser = await request(app).post("/user").send(user);

    expect(newUser.status).toEqual(400);
    expect(newUser.body).toHaveProperty("errors");
  });
});

describe("Test user update", () => {
  test("It should response the PUT method with a user with a updated name", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const updateUser = await request(app)
      .put(`/user/${newUser.body.id}`)
      .send({
        username: `updated_${randomUser}`,
        name: "updated_test_name",
      });

    expect(updateUser.body).toHaveProperty("id");
    expect(updateUser.body).toHaveProperty("username", `updated_${randomUser}`);
    expect(updateUser.body).toHaveProperty("name", "updated_test_name");
  });

  test("It should response the PUT method with a BadRequest by user not found", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const updateUser = await request(app)
      .put(`/user/${uuidv4()}`)
      .send({
        username: `updated_${randomUser}`,
        name: "updated_test_name",
      });

    expect(updateUser.status).toEqual(400);
    expect(updateUser.body).toHaveProperty("data");
  });

  test("It should response the PUT method with a BadRequest by wrong validation", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const updateUser = await request(app).put(`/user/${uuidv4()}`).send({
      name: "updated_test_name",
    });

    expect(updateUser.status).toEqual(400);
    expect(updateUser.body).toHaveProperty("errors");
  });
});

describe("Test user change password", () => {
  test("It should response the PUT method with true by updating password", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    const updatedPassword = await request(app)
      .put(`/user/password/${newUser.body.id}`)
      .send({
        password: "new_password",
      })
      .set("authorization", jwtData.body.data);

    expect(updatedPassword.body).toBe(true);
  });

  test("It should response the PUT method with BadRequest by wrong user ID", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    const updatedPassword = await request(app)
      .put(`/user/password/${uuidv4()}`)
      .send({
        password: "new_password",
      })
      .set("authorization", jwtData.body.data);

    expect(updatedPassword.status).toEqual(400);
    expect(updatedPassword.body).toHaveProperty("data");
  });

  test("It should response the PUT method with BadRequest by wrong validation", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    const updatedPassword = await request(app)
      .put(`/user/password/${uuidv4()}`)
      .send({
        password: "new_password",
      });

    expect(updatedPassword.status).toEqual(400);
    expect(updatedPassword.body).toHaveProperty("errors");
  });

  test("It should response the PUT method with BadRequest by malformed JWT", async () => {
    const randomUser = `test_username_${Math.random()}`;
    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    const updatedPassword = await request(app)
      .put(`/user/password/${uuidv4()}`)
      .send({
        password: "new_password",
      })
      .set("authorization", "A.B.C");

    expect(updatedPassword.status).toEqual(400);
    expect(updatedPassword.body).toHaveProperty("data");
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

  test("It should response the GET method with a BadRequest by username not found", async () => {
    const user = await request(app).get(`/user/${uuidv4()}`);

    expect(user.status).toEqual(400);
    expect(user.body).toHaveProperty("data");
  });
});
