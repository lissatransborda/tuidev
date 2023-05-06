const argon2 = require("argon2");

import { UserRepository } from "../repositories/UserRepository";
import { PublicUser } from "../entities/PublicUser";
import { User } from "../entities/User";
import { PublicUserWithoutArticles } from "../entities/PublicUserWithoutArticles";
const userRepository = new UserRepository();

class UserService {
  async create(user: User) {
    user.password = await argon2.hash(user.password);
    const userDB = await userRepository.create(user);

    return new PublicUser(userDB.id, userDB.username, userDB.name, []);
  }

  async update(user: User, id: string) {
    const userDB = await userRepository.update(user, id);

    return new PublicUserWithoutArticles(
      userDB.id,
      userDB.username,
      userDB.name
    );
  }

  async changePassword(password: string, id: string) {
    await userRepository.changePassword(password, id);
    return true;
  }

  async getAll() {
    const usersDB = await userRepository.getAll();
    const usersReturned: Array<PublicUserWithoutArticles> = [];

    usersDB.forEach((user: User) => {
      usersReturned.push(
        new PublicUserWithoutArticles(user.id, user.username, user.name)
      );
    });

    return usersReturned;
  }

  async getById(id: string) {
    const userDB = await userRepository.getById(id);

    if (!userDB) {
      return null;
    }

    return new PublicUser(
      userDB.id,
      userDB.username,
      userDB.name,
      userDB.articles
    );
  }

  async getByUsername(username: string) {
    const userDB = await userRepository.getByUsername(username);

    if (!userDB) {
      return null;
    }

    return new PublicUser(
      userDB.id,
      userDB.username,
      userDB.name,
      userDB.articles
    );
  }
}

export { UserService };
