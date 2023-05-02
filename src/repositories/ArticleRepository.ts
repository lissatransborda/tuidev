import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { Article } from "../entities/Article";

const prisma = new PrismaClient();

class ArticleRepository {
  async create(articleData: Article) {
    const article = await prisma.article.create({
      data: {
        id: uuidv4(),
        title: articleData.title,
        body: articleData.body,
        url: articleData.url,
        author: {
          connect: {
            id: articleData.authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });

    return article;
  }

  async getById(id: string) {
    const article = prisma.article.findUnique({
      where: { id: id },
      include: { author: true },
    });
    return article;
  }

  async getAll() {
    const articles = prisma.article.findMany({ include: { author: true } });
    return articles;
  }
}

export { ArticleRepository };
