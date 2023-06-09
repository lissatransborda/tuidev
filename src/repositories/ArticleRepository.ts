import { PrismaClient } from "@prisma/client";
import { Article } from "../entities/Article";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

class ArticleRepository {
  async create(articleData: Article) {
    return (await prisma.article.create({
      data: {
        id: randomUUID(),
        title: articleData.title,
        body: articleData.body,
        url: articleData.url,
        created_at: new Date(),
        updated_at: new Date(),
        author: {
          connect: {
            id: articleData.authorId,
          },
        },
      },
      include: {
        author: true,
      },
    })) as Article;
  }

  async update(articleData: Article, id: string) {
    return (await prisma.article.update({
      where: {
        id: id,
      },
      data: {
        title: articleData.title,
        body: articleData.body,
        url: articleData.url,
        updated_at: new Date(),
      },
      include: {
        author: true,
      },
    })) as Article;
  }

  async getById(id: string) {
    return (await prisma.article.findUnique({
      where: { id: id },
      include: { author: true },
    })) as Article;
  }

  async getAll() {
    return (await prisma.article.findMany({
      include: { author: true },
    })) as Array<Article>;
  }
}

export { ArticleRepository };
