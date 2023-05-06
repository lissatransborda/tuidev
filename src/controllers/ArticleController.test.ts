const request = require("supertest");
import { app } from "../app";
import { Article } from "../entities/Article";
import { randomUUID } from "crypto";

describe("test article create", () => {
  test("It should response the POST method with the created article", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
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
      })
      .set("authorization", jwtData.body.data);

    expect(newArticle.body).toHaveProperty("id");
    expect(newArticle.body).toHaveProperty("title", "test_title");
    expect(newArticle.body).toHaveProperty("body", "test_body");
    expect(newArticle.body).toHaveProperty("url");
  });

  test("It should response the POST method with a BadRequest by JWT and user being different", async () => {
    const randomUser = `test_username_${Math.random()}`;

    await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
      username: randomUser,
      password: "test_password",
    });

    const articleTitle = "test_title";

    const newArticle = await request(app)
      .post("/article")
      .send({
        title: articleTitle,
        body: "test_body",
        authorId: randomUUID(),
      })
      .set("authorization", jwtData.body.data);

    expect(newArticle.status).toEqual(400);
    expect(newArticle.body).toHaveProperty("data");
  });

  test("It should response the POST method with a BadRequest by wrong validation", async () => {
    const articleTitle = "test_title";

    const newArticle = await request(app)
      .post("/article")
      .send({ title: articleTitle, body: "test_body" });

    expect(newArticle.status).toEqual(400);
    expect(newArticle.body).toHaveProperty("errors");
  });

  test("It should response the POST method with a BadRequest by malformed jwt", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const newArticle = await request(app)
      .post("/article")
      .send({
        title: "test_title",
        body: "test_body",
        authorId: newUser.body.id,
      })
      .set("authorization", "A.B.C");

    expect(newArticle.status).toEqual(400);
    expect(newArticle.body).toHaveProperty("data");
  });
});

describe("Test article update", () => {
  test("It should response the PUT method with the updated article", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
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
      })
      .set("authorization", jwtData.body.data);

    const updatedArticle = await request(app)
      .put(`/article/${newArticle.body.id}`)
      .send({
        title: `updated_${articleTitle}`,
        body: "test_body",
        authorId: newUser.body.id,
      })
      .set("authorization", jwtData.body.data);

    expect(updatedArticle.body).toHaveProperty("id");
    expect(updatedArticle.body).toHaveProperty("title", "updated_test_title");
    expect(updatedArticle.body).toHaveProperty("body", "test_body");
    expect(updatedArticle.body).toHaveProperty("url");
  });

  test("It should response the PUT method with a BadRequest by author doesn't exist", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
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
      })
      .set("authorization", jwtData.body.data);

    const updatedArticle = await request(app)
      .put(`/article/${newArticle.body.id}`)
      .send({
        title: `updated_${articleTitle}`,
        body: "test_body",
        authorId: randomUUID(),
      })
      .set("authorization", jwtData.body.data);

    expect(updatedArticle.status).toEqual(404);
    expect(updatedArticle.body).toHaveProperty("data");
  });

  test("It should response the PUT method with a BadRequest by wrong validation", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
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
      })
      .set("authorization", jwtData.body.data);

    const updatedArticle = await request(app)
      .put(`/article/${newArticle.body.id}`)
      .send({
        authorId: newUser.body.id,
      })
      .set("authorization", jwtData.body.data);

    expect(updatedArticle.status).toEqual(400);
    expect(updatedArticle.body).toHaveProperty("errors");
  });

  test("It should response the PUT method with a BadRequest by malformed jwt", async () => {
    const randomUser = `test_username_${Math.random()}`;

    const newUser = await request(app).post("/user").send({
      username: randomUser,
      password: "test_password",
      name: "test_name",
    });

    const jwtData = await request(app).post("/login").send({
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
      })
      .set("authorization", jwtData.body.data);

    const updatedArticle = await request(app)
      .put(`/article/${newArticle.body.id}`)
      .send({
        title: `updated_${articleTitle}`,
        body: "test_body",
        authorId: newUser.body.id,
      })
      .set("authorization", "A.B.C");

    expect(updatedArticle.status).toEqual(400);
    expect(updatedArticle.body).toHaveProperty("data");
  });
});

describe("Test article getAll", () => {
  test("It should response the GET method with a list of articles", async () => {
    const articles = await request(app).get("/articles");

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
    const articles = await request(app).get("/articles");

    const article = await request(app).get(`/article/${articles.body[0].id}`);

    expect(article.body).toHaveProperty("title");
    expect(article.body).toHaveProperty("body");
    expect(article.body).toHaveProperty("authorId");
    expect(article.body).toHaveProperty("author");
  });

  test("It should response the GET method with a BadRequest by wrong ID", async () => {
    const article = await request(app).get(`/article/${randomUUID()}`);

    expect(article.status).toEqual(404);
    expect(article.body).toHaveProperty("data");
  });
});
