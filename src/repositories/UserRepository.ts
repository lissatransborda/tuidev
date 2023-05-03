import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { User } from "../entities/User";

const prisma = new PrismaClient();

class UserRepository {
  async create(userData: User) {
    return (await prisma.user.create({
      data: {
        id: uuidv4(),
        username: userData.username,
        password: userData.password,
        name: userData.name,
        articles: {},
      },
    })) as User;
  }

  async getById(id: string) {
    return (await prisma.user.findUnique({
      where: { id: id },
      include: { articles: true },
    })) as User;
  }

  async getByUsername(username: string) {
    return (await prisma.user.findUnique({
      where: { username: username },
      include: { articles: true },
    })) as User;
  }

  async getAll() {
    return (await prisma.user.findMany()) as Array<User>;
  }
}

export { UserRepository };
