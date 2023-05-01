import { UserService } from "./UserService";
import { User } from "../entities/User";
import { v4 as uuidv4 } from 'uuid';

const userId = uuidv4()
        const randomUser = `test_username_${Math.random()}`;

describe("Test UserService", () => {
    test("It should return the created user", async () => {
        const userService = new UserService();
        const user = new User(userId, randomUser, "test_password", "test_name", [])
        
        const userCreated = await userService.create(user)

        expect(userCreated).toHaveProperty("id");
        expect(userCreated).toHaveProperty("username");
        expect(userCreated).toHaveProperty("name");
    })

  test("It should return the list of users", async () => {
    const userService = new UserService();
    const list = await userService.getAll();

    if (list.length > 0 ){
        list.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("name");
        });
    }
  });

  test("It should return one user by username", async () => {
    const userService = new UserService();
    const user = await userService.getByUsername(randomUser);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("name");
    })

  test("It should return null using getUserByUsername", async () => {
    const userService = new UserService();
    const user = await userService.getByUsername("9999999");

    expect(user).toBeNull()
    })

  });