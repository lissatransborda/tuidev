import { UserService } from "./UserService";
import { User } from "../entities/User";
import { randomUUID } from "crypto";

describe("Test UserService", () => {
  test("It should return the created user", async () => {
    const userService = new UserService();
    const randomUser = `test_username_${Math.random()}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    const userCreated = await userService.create(user);

    expect(userCreated).toHaveProperty("id");
    expect(userCreated).toHaveProperty("username");
    expect(userCreated).toHaveProperty("name");
    expect(userCreated).toHaveProperty("created_at");
    expect(userCreated).toHaveProperty("updated_at");
  });

  test("It should return the updated user", async () => {
    const userService = new UserService();
    const randomUser = `test_username_${Math.random()}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    const userDB = await userService.create(user);
    user.username = `updated_${randomUser}`;
    const userUpdated = await userService.update(user, userDB.id);

    expect(userUpdated).toHaveProperty("id");
    expect(userUpdated).toHaveProperty("username");
    expect(userUpdated).toHaveProperty("name");
    expect(userUpdated).toHaveProperty("created_at");
    expect(userUpdated).toHaveProperty("updated_at");
  });

  test("It should return the updated password", async () => {
    const userService = new UserService();
    const randomUser = `test_username_${Math.random()}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    const userDB = await userService.create(user);
    user.username = `updated_${randomUser}`;
    const userUpdated = await userService.changePassword(
      "new_password",
      userDB.id
    );

    expect(userUpdated).toBeTruthy();
  });

  test("It should return the list of users", async () => {
    const userService = new UserService();
    const list = await userService.getAll();

    if (list.length > 0) {
      list.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("created_at");
      });
    }
  });

  test("It should return one user by id", async () => {
    const userService = new UserService();
    const randomUser = `test_username_${Math.random()}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    const userCreated = await userService.create(user);

    const userSearched = await userService.getById(userCreated.id);

    expect(userSearched).toHaveProperty("id");
    expect(userSearched).toHaveProperty("username");
    expect(userSearched).toHaveProperty("name");
    expect(userSearched).toHaveProperty("created_at");
  });

  test("It should return null using getUserById", async () => {
    const userService = new UserService();
    const user = await userService.getById("9999999");

    expect(user).toBeNull();
  });

  test("It should return one user by username", async () => {
    const userService = new UserService();
    const randomUser = `test_username_${Math.random()}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    await userService.create(user);

    const userSearched = await userService.getByUsername(user.username);

    expect(userSearched).toHaveProperty("id");
    expect(userSearched).toHaveProperty("username");
    expect(userSearched).toHaveProperty("name");
    expect(userSearched).toHaveProperty("created_at");
  });

  test("It should return null using getUserByUsername", async () => {
    const userService = new UserService();
    const user = await userService.getByUsername("9999999");

    expect(user).toBeNull();
  });
});
