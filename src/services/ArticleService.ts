import { ArticleRepository } from "../repositories/ArticleRepository";
import { Article } from "../entities/Article";
import { PublicUserWithoutArticles } from "../entities/PublicUserWithoutArticles";
import { PublicArticle } from "../entities/PublicArticle";

const articleRepository = new ArticleRepository();

class ArticleService {
  async create(article: Article) {
    const articleCreated = await articleRepository.create(article);

    const publicAuthor = new PublicUserWithoutArticles(
      articleCreated.author.id,
      articleCreated.author.username,
      articleCreated.author.name
    );
    const articleReturned = new PublicArticle(
      articleCreated.id,
      publicAuthor,
      publicAuthor.id,
      articleCreated.title,
      articleCreated.body,
      articleCreated.url
    );

    return articleReturned;
  }
  async getAll() {
    return await articleRepository.getAll();
  }
  async getById(id: string) {
    return (await articleRepository.getById(id)) ?? null;
  }
}

export { ArticleService };
