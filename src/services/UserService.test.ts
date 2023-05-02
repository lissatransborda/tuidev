import { UserService } from "./UserService";
import { User } from "../entities/User";
import { v4 as uuidv4 } from "uuid";
import { PublicUser } from "../entities/PublicUser";

const randomUser = `test_username_${Math.random()}`;
let testUser: PublicUser;

describe("Test UserService", () => {
  test("It should return the created user", async () => {
    const userService = new UserService();
    const user = new User(
      uuidv4(),
      randomUser,
      "test_password",
      "test_name",
      []
    );

    const userCreated = await userService.create(user);
    testUser = userCreated;

    expect(userCreated).toHaveProperty("id");
    expect(userCreated).toHaveProperty("username");
    expect(userCreated).toHaveProperty("name");
  });

  test("It should return the list of users", async () => {
    const userService = new UserService();
    const list = await userService.getAll();

    if (list.length > 0) {
      list.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("name");
      });
    }
  });

  test("It should return one user by id", async () => {
    const userService = new UserService();
    const user = await userService.getById(testUser.id);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("name");
  });

  test("It should return null using getUserById", async () => {
    const userService = new UserService();
    const user = await userService.getById("9999999");

    expect(user).toBeNull();
  });

  test("It should return one user by username", async () => {
    const userService = new UserService();
    const user = await userService.getByUsername(randomUser);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("name");
  });

  test("It should return null using getUserByUsername", async () => {
    const userService = new UserService();
    const user = await userService.getByUsername("9999999");

    expect(user).toBeNull();
  });
});
