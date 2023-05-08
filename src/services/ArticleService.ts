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
      created_at: articleCreated.author.created_at,
    };

    return <Article>{
      id: articleCreated.id,
      author: publicAuthor,
      authorId: publicAuthor.id,
      title: articleCreated.title,
      body: articleCreated.body,
      url: articleCreated.url,
      created_at: articleCreated.created_at,
      updated_at: articleCreated.updated_at,
    };
  }

  async update(article: Article, id: string) {
    const articleUpdated = await articleRepository.update(article, id);

    const publicAuthor = <User>{
      id: articleUpdated.author.id,
      username: articleUpdated.author.username,
      name: articleUpdated.author.name,
      created_at: articleUpdated.author.created_at,
    };

    return <Article>{
      id: articleUpdated.id,
      author: publicAuthor,
      authorId: publicAuthor.id,
      title: articleUpdated.title,
      body: articleUpdated.body,
      url: articleUpdated.url,
      created_at: articleUpdated.created_at,
      updated_at: articleUpdated.updated_at,
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
        created_at: article.author.created_at,
      };

      articlesReturned.push(<Article>{
        id: article.id,
        author: publicAuthor,
        authorId: publicAuthor.id,
        title: article.title,
        body: article.body,
        url: article.url,
        created_at: article.created_at,
        updated_at: article.updated_at,
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
      created_at: articleDB.author.created_at,
    };

    return <Article>{
      id: articleDB.id,
      author: publicAuthor,
      authorId: publicAuthor.id,
      title: articleDB.title,
      body: articleDB.body,
      url: articleDB.url,
      created_at: articleDB.created_at,
      updated_at: articleDB.updated_at,
    };
  }
}

export { ArticleService };
