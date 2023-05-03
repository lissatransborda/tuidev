const argon2 = require("argon2");

import { UserRepository } from "../repositories/UserRepository";
import { PublicUser } from "../entities/PublicUser";
import { User } from "../entities/User";
const userRepository = new UserRepository();

class UserService {
  async create(user: User) {
    user.password = await argon2.hash(user.password);
    const userDB = await userRepository.create(user);

    return new PublicUser(userDB.id, userDB.username, userDB.name, []);
  }
  async getAll() {
    const usersDB = await userRepository.getAll();
    const usersReturned: Array<PublicUser> = [];

    usersDB.forEach((user: User) => {
      usersReturned.push(new PublicUser(user.id, user.username, user.name, []));
    });

    return usersReturned;
  }

  async getById(id: string) {
    const userDB = await userRepository.getById(id);

    if (!userDB) {
      return null;
    }

    return new PublicUser(userDB.id, userDB.username, userDB.name, []);
  }

  async getByUsername(username: string) {
    const userDB = await userRepository.getByUsername(username);

    if (!userDB) {
      return null;
    }

    return new PublicUser(userDB.id, userDB.username, userDB.name, []);
  }
}

export { UserService };
