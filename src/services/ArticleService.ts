import { ArticleRepository } from "../repositories/ArticleRepository";
import { Article } from "../entities/Article";
import { User } from "../entities/User";

const articleRepository = new ArticleRepository();

class ArticleService {
  async create(article: Article) {
    const articleCreated = await articleRepository.create(article);

    const publicAuthor = <User>{
      id: articleCreated.author.id,
      username: articleCreated.author.username,
      name: articleCreated.author.name,
    };

    return <Article>{
      id: articleCreated.id,
      author: publicAuthor,
      authorId: publicAuthor.id,
      title: articleCreated.title,
      body: articleCreated.body,
      url: articleCreated.url,
    };
  }

  async update(article: Article, id: string) {
    const articleUpdated = await articleRepository.update(article, id);

    const publicAuthor = <User>{
      id: articleUpdated.author.id,
      username: articleUpdated.author.username,
      name: articleUpdated.author.name,
    };

    return <Article>{
      id: articleUpdated.id,
      author: publicAuthor,
      authorId: publicAuthor.id,
      title: articleUpdated.title,
      body: articleUpdated.body,
      url: articleUpdated.url,
    };
  }

  async getAll() {
    const articlesDB = await articleRepository.getAll();
    const articlesReturned: Array<Article> = [];

    articlesDB.forEach((article: Article) => {
      const publicAuthor = <User>{
        id: article.author.id,
        username: article.author.username,
        name: article.author.name,
      };

      articlesReturned.push(<Article>{
        id: article.id,
        author: publicAuthor,
        authorId: publicAuthor.id,
        title: article.title,
        body: article.body,
        url: article.url,
      });
    });

    return articlesReturned;
  }
  async getById(id: string) {
    const articleDB = (await articleRepository.getById(id)) ?? null;

    if (!articleDB) {
      return null;
    }

    const publicAuthor = <User>{
      id: articleDB.author.id,
      username: articleDB.author.username,
      name: articleDB.author.name,
    };

    return <Article>{
      id: articleDB.id,
      author: publicAuthor,
      authorId: publicAuthor.id,
      title: articleDB.title,
      body: articleDB.body,
      url: articleDB.url,
    };
  }
}

export { ArticleService };
