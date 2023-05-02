const argon2 = require("argon2");
require("dotenv").config();
import { UserRepository } from "../repositories/UserRepository";
import { Login } from "../entities/Login";
import jwt from "jsonwebtoken";
import { PublicUser } from "../entities/PublicUser";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

const userRepository = new UserRepository();

class LoginService {
  async login(login: Login): Promise<string | null> {
    const user = await userRepository.getByUsername(login.username);

    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, login.password)) {
      const returnedUser = new PublicUser(
        user.id,
        user.username,
        user.name,
        []
      );
      return jwt.sign({ ...returnedUser }, JWT_PRIVATE_KEY);
    } else {
      return null;
    }
  }
}

export { LoginService };
