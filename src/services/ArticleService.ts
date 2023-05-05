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

  async update(article: Article, id: string) {
    const articleUpdated = await articleRepository.update(article, id);

    const publicAuthor = new PublicUserWithoutArticles(
      articleUpdated.author.id,
      articleUpdated.author.username,
      articleUpdated.author.name
    );

    return new PublicArticle(
      articleUpdated.id,
      publicAuthor,
      publicAuthor.id,
      articleUpdated.title,
      articleUpdated.body,
      articleUpdated.url
    );
  }

  async getAll() {
    const articlesDB = await articleRepository.getAll();
    const articlesReturned: Array<PublicArticle> = [];

    articlesDB.forEach((article: PublicArticle) => {
    const publicAuthor = new PublicUserWithoutArticles(
      article.author.id,
      article.author.username,
      article.author.name
    );

    articlesReturned.push(new PublicArticle(
      article.id,
      publicAuthor,
      publicAuthor.id,
      article.title,
      article.body,
      article.url
    ));
    });

    return articlesReturned;
  }
  async getById(id: string) {
    const articleDB = await articleRepository.getById(id) ?? null;

    if (!articleDB){
      return null
    }

    const publicAuthor = new PublicUserWithoutArticles(
      articleDB.author.id,
      articleDB.author.username,
      articleDB.author.name
    );

    return new PublicArticle(
      articleDB.id,
      publicAuthor,
      publicAuthor.id,
      articleDB.title,
      articleDB.body,
      articleDB.url
    );
  }
}

export { ArticleService };
