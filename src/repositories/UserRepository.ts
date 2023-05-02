import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { User } from "../entities/User";

const prisma = new PrismaClient();

class UserRepository {
  async create(userData: User) {
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        username: userData.username,
        password: userData.password,
        name: userData.name,
        articles: {},
      },
    });

    return user;
  }

  async getById(id: string) {
    return await prisma.user.findUnique({
      where: { id: id },
      include: { articles: true },
    });
  }

  async getByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username: username },
      include: { articles: true },
    });
  }

  async getAll() {
    const users = prisma.user.findMany();
    return users;
  }
}

export { UserRepository };
