const argon2 = require("argon2");
require("dotenv").config();
import { Login } from "../entities/Login";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

const userRepository = new UserRepository();

class LoginService {
  async login(login: Login): Promise<string | null> {
    const user = await userRepository.getByUsername(login.username);

    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, login.password)) {
      const returnedUser = <User>{
        id: user.id,
        username: user.username,
        name: user.name,
        articles: [],
      };
      return jwt.sign({ ...returnedUser }, JWT_PRIVATE_KEY);
    } else {
      return null;
    }
  }
}

export { LoginService };
