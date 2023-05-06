import { UserService } from "./UserService";
import { ArticleService } from "./ArticleService";
import { Article } from "../entities/Article";
import { User } from "../entities/User";
import { randomUUID } from "crypto";

describe("Test ArticleService", () => {
  test("It should return the created article", async () => {
    const articleService = new ArticleService();
    const userService = new UserService();

    const title = "test_title";
    const randomUser = `test_username_${Math.random()}`;
    const url = `${randomUser}/${title.replace(" ", "-")}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };
    const userCreated = await userService.create(user);

    const article = <Article>{
      id: randomUUID(),
      author: user,
      authorId: userCreated.id,
      title: "test_title",
      body: "test_body",
      url: url,
    };
    const articleCreated = await articleService.create(article);

    expect(articleCreated).toHaveProperty("title");
    expect(articleCreated).toHaveProperty("body");
    expect(articleCreated).toHaveProperty("authorId");
    expect(articleCreated).toHaveProperty("author");
  });

  test("It should return the updated article", async () => {
    const articleService = new ArticleService();
    const userService = new UserService();

    const title = "test_title";
    const randomUser = `test_username_${Math.random()}`;
    const url = `${randomUser}/${title.replace(" ", "-")}`;

    const user = <User>{
      id: randomUUID(),
      username: randomUser,
      password: "test_password",
      name: "test_name",
      articles: [],
    };

    const userCreated = await userService.create(user);

    const article = <Article>{
      id: randomUUID(),
      author: user,
      authorId: userCreated.id,
      title: "test_title",
      body: "test_body",
      url: url,
    };
    const articleCreated = await articleService.create(article);
    article.title = "updated_test_title";
    const articleUpdated = await articleService.update(
      article,
      articleCreated.id
    );

    expect(articleUpdated).toHaveProperty("title");
    expect(articleUpdated).toHaveProperty("body");
    expect(articleUpdated).toHaveProperty("authorId");
    expect(articleUpdated).toHaveProperty("author");
  });

  test("It should return the list of users", async () => {
    const articleService = new ArticleService();
    const list = await articleService.getAll();

    if (list.length > 0) {
      list.forEach((article: Article) => {
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("authorId");
        expect(article).toHaveProperty("author");
      });
    }
  });

  test("It should return one article", async () => {
    const articleService = new ArticleService();
    const list = await articleService.getAll();
    const article = await articleService.getById(list[0].id);

    expect(article).toHaveProperty("title");
    expect(article).toHaveProperty("body");
    expect(article).toHaveProperty("authorId");
    expect(article).toHaveProperty("author");
  });

  test("It should return a null because the article doesn't exist", async () => {
    const articleService = new ArticleService();
    const article = await articleService.getById("999");

    expect(article).toEqual(null);
  });
});
