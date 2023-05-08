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
      created_at: userDB.created_at,
      updated_at: userDB.updated_at,
    };
  }

  async update(user: User, id: string) {
    const userDB = await userRepository.update(user, id);

    return <User>{
      id: userDB.id,
      username: userDB.username,
      name: userDB.name,
      articles: userDB.articles,
      created_at: userDB.created_at,
      updated_at: userDB.updated_at,
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
        created_at: user.created_at,
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
      created_at: userDB.created_at,
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
      created_at: userDB.created_at,
    };
  }
}

export { UserService };
