import { UserWithoutArticles } from "./UserWithoutArticles";

class Article {
  id: string;
  author: UserWithoutArticles;
  authorId: string;
  title: string;
  body: string;
  url: string;

  constructor(
    id: string,
    author: UserWithoutArticles,
    authorId: string,
    title: string,
    body: string,
    url: string
  ) {
    this.id = id;
    this.author = author;
    this.authorId = authorId;
    this.title = title;
    this.body = body;
    this.url = url;
  }
}

export { Article };
