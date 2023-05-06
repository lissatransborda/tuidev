require("dotenv").config();
const jwt = require("jsonwebtoken");

import { LoginService } from "./LoginService";
import { UserService } from "./UserService";
import { User } from "../entities/User";
import { Login } from "../entities/Login";
import { randomUUID } from "crypto";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

describe("Test LoginService", () => {
  test("It should return the JWT", async () => {
    const userService = new UserService();
    const loginService = new LoginService();

    const randomUser = `test_username_${Math.random()}`;
    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    await userService.create(user);

    const login = <Login>{ username: randomUser, password: "test_password" };
    const loginData = await loginService.login(login);

    const result = await jwt.verify(loginData, JWT_PRIVATE_KEY);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("username");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("iat");
  });

  test("It should return null with the wrong password", async () => {
    const userService = new UserService();
    const loginService = new LoginService();

    const randomUser = `test_username_${Math.random()}`;
    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    await userService.create(user);

    const login = <Login>{ username: randomUser, password: "test_password" };
    const loginData = await loginService.login(login);

    expect(loginData).toBeNull;
  });

  test("It should return null with the wrong username", async () => {
    const userService = new UserService();
    const loginService = new LoginService();

    const randomUser = `test_username_${Math.random()}`;
    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    await userService.create(user);

    const login = <Login>{ username: "wrong_user", password: "test_password" };
    const loginData = await loginService.login(login);

    expect(loginData).toBeNull;
  });
});
