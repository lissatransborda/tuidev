const argon2 = require("argon2");

import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
const userRepository = new UserRepository();

class UserService {
  async create(user: User) {
    user.password = await argon2.hash(user.password);
    const userDB = await userRepository.create(user);

    return <User>{
      id: userDB.id,
      username: userDB.username,
      name: userDB.name,
    };
  }

  async update(user: User, id: string) {
    const userDB = await userRepository.update(user, id);

    return <User>{
      id: userDB.id,
      username: userDB.username,
      name: userDB.name,
      articles: userDB.articles,
    };
  }

  async changePassword(password: string, id: string) {
    await userRepository.changePassword(password, id);
    return true;
  }

  async getAll() {
    const usersDB = await userRepository.getAll();
    const usersReturned: Array<User> = [];

    usersDB.forEach((user: User) => {
      usersReturned.push(<User>{
        id: user.id,
        username: user.username,
        name: user.name,
      });
    });

    return usersReturned;
  }

  async getById(id: string) {
    const userDB = await userRepository.getById(id);

    if (!userDB) {
      return null;
    }

    return <User>{
      id: userDB.id,
      username: userDB.username,
      name: userDB.name,
      articles: userDB.articles,
    };
  }

  async getByUsername(username: string) {
    const userDB = await userRepository.getByUsername(username);

    if (!userDB) {
      return null;
    }

    return <User>{
      id: userDB.id,
      username: userDB.username,
      name: userDB.name,
      articles: userDB.articles,
    };
  }
}

export { UserService };
