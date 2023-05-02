const request = require("supertest");
import { app } from "../app";
import { Article } from "../entities/Article";

describe("test article create", () => {
  test("It should response the POST method with the created article", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app)
      .post("/user")
      .send({
        username: randomUser,
        password: "test_password",
        name: "test_name",
      });

    const jwtData = await request(app)
      .post("/login")
      .send({
        username: randomUser,
        password: "test_password",
      });

    const articleTitle = "test_title";

    const newArticle = await request(app)
      .post("/article")
      .send({
        title: articleTitle,
        body: "test_body",
        authorId: newUser.body.id,
      }).set("Authorization", jwtData.body.data);

    expect(newArticle.body).toHaveProperty("id");
    expect(newArticle.body).toHaveProperty("title", "test_title");
    expect(newArticle.body).toHaveProperty("body", "test_body");
    expect(newArticle.body).toHaveProperty(
      "url",
      `${newUser.body.username}/${articleTitle.replace(" ", "-")}`
    );
  });

  test("It should response the POST method with a BadRequest, saying that the authorization header doesn't exist", async () => {
    const articleTitle = "test_title";

    const newArticle = await request(app)
      .post("/article")
      .send({ title: articleTitle, body: "test_body", authorId: "999" });

    expect(newArticle.status).toEqual(400);
    expect(newArticle.body).toHaveProperty("data");
  });
});

describe("Test article getAll", () => {
  test("It should response the GET method with a list of articles", async () => {
    const articles = await request(app).get("/article");

    articles.body.forEach((article: Article) => {
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("authorId");
      expect(article).toHaveProperty("author");
    });
  });
});

describe("Test article getById", () => {
  test("It should response the GET method with one article", async () => {
    const articles = await request(app).get("/article");

    const article = await request(app).get(`/article/${articles.body[0].id}`);

    expect(article.body).toHaveProperty("title");
    expect(article.body).toHaveProperty("body");
    expect(article.body).toHaveProperty("authorId");
    expect(article.body).toHaveProperty("author");
  });
});
