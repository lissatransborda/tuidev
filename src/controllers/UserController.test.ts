const request = require("supertest");
import { randomUUID } from "crypto";
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
    expect(newUser.body).toHaveProperty("created_at");
    expect(newUser.body).toHaveProperty("updated_at");
  });

  test("It should response the POST method with an Bad Request by the user alredy exists", async () => {
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

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    const updateUser = await request(app)
      .put(`/user/${newUser.body.id}`)
      .send({
        username: `updated_${randomUser}`,
        name: "updated_test_name",
      })
      .set("authorization", jwtData.body.data);

    expect(updateUser.body).toHaveProperty("id");
    expect(updateUser.body).toHaveProperty("username", `updated_${randomUser}`);
    expect(updateUser.body).toHaveProperty("name", "updated_test_name");
    expect(updateUser.body).toHaveProperty("created_at");
    expect(updateUser.body).toHaveProperty("updated_at");
  });

  test("It should response the PUT method with a BadRequest by user and JWT different", async () => {
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

    const updateUser = await request(app)
      .put(`/user/${randomUUID()}`)
      .send({
        username: `updated_${randomUser}`,
        name: "updated_test_name",
      })
      .set("authorization", jwtData.body.data);

    expect(updateUser.status).toEqual(400);
    expect(updateUser.body).toHaveProperty("data");
  });

  test("It should response the PUT method with a BadRequest by malformed JWT", async () => {
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

    const updateUser = await request(app)
      .put(`/user/${newUser.body.id}`)
      .send({
        username: `updated_${randomUser}`,
        name: "updated_test_name",
      })
      .set("authorization", "A.B.C");

    expect(updateUser.status).toEqual(400);
    expect(updateUser.body).toHaveProperty("data");
  });

  test("It should response the PUT method with a BadRequest by wrong validation", async () => {
    const randomUser = `test_username_${Math.random()}`;
    await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const updateUser = await request(app).put(`/user/${randomUUID()}`).send({
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
      .put(`/user/${newUser.body.id}/password`)
      .send({
        password: "new_password",
      })
      .set("authorization", jwtData.body.data);

    expect(updatedPassword.body).toBe(true);
  });

  test("It should response the PUT method with BadRequest by user and JWT being different", async () => {
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

    const updatedPassword = await request(app)
      .put(`/user/${randomUUID()}/password`)
      .send({
        password: "new_password",
      })
      .set("authorization", jwtData.body.data);

    expect(updatedPassword.status).toEqual(400);
    expect(updatedPassword.body).toHaveProperty("data");
  });

  test("It should response the PUT method with BadRequest by wrong validation", async () => {
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

    const updatedPassword = await request(app)
      .put(`/user/${randomUUID()}/password`)
      .send({
        password: "new_password",
      });

    expect(updatedPassword.status).toEqual(400);
    expect(updatedPassword.body).toHaveProperty("errors");
  });

  test("It should response the PUT method with BadRequest by malformed JWT", async () => {
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

    const updatedPassword = await request(app)
      .put(`/user/${randomUUID()}/password`)
      .send({
        password: "new_password",
      })
      .set("authorization", "A.B.C");

    expect(updatedPassword.status).toEqual(400);
    expect(updatedPassword.body).toHaveProperty("data");
  });
});

describe("Test user get", () => {
  test("It should response the GET method with a list of users", async () => {
    const users = await request(app).get("/user");

    if (users.body.length > 0) {
      users.body.forEach((user: User) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("created_at");
      });
    } else {
      expect(users.body).toEqual([]);
    }
  });

  test("It should response the GET method with one user", async () => {
    const users = await request(app).get("/user");

    const user = await request(app).get(
      `/user?username=${users.body[0].username}`
    );

    expect(user.body).toHaveProperty("id");
    expect(user.body).toHaveProperty("username");
    expect(user.body).toHaveProperty("name");
    expect(user.body).toHaveProperty("created_at");
  });

  test("It should response the GET method with BadRequest because the user was not found", async () => {
    const user = await request(app).get(`/user?username=${randomUUID()}`);

    expect(user.status).toEqual(404);
    expect(user.body).toHaveProperty("data");
  });
});
