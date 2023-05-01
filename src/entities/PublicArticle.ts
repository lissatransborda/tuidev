import { PublicUserWithoutArticles } from "./PublicUserWithoutArticles";

class PublicArticle {
  id: string;
  author: PublicUserWithoutArticles;
  authorId: string;
  title: string;
  body: string;
  url: string;

  constructor(
    id: string,
    author: PublicUserWithoutArticles,
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

export { PublicArticle };
