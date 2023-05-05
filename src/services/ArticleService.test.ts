import { UserService } from "./UserService";
import { ArticleService } from "./ArticleService";
import { Article } from "../entities/Article";
import { User } from "../entities/User";
import { v4 as uuidv4 } from "uuid";
import { PublicArticle } from "../entities/PublicArticle";

describe("Test ArticleService", () => {
  test("It should return the created article", async () => {
    const articleService = new ArticleService();
    const userService = new UserService();

    const title = "test_title";
    const randomUser = `test_username_${Math.random()}`;
    const url = `${randomUser}/${title.replace(" ", "-")}`;

    const user = new User(
      uuidv4(),
      randomUser,
      "test_password",
      "test_name",
      []
    );
    const userCreated = await userService.create(user);

    const article = new Article(
      uuidv4(),
      user,
      userCreated.id,
      "test_title",
      "test_body",
      url
    );
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

    const user = new User(
      uuidv4(),
      randomUser,
      "test_password",
      "test_name",
      []
    );

    const userCreated = await userService.create(user);

    const article = new Article(
      uuidv4(),
      user,
      userCreated.id,
      "test_title",
      "test_body",
      url
    );
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
      list.forEach((article: PublicArticle) => {
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
