class Article {
  id: string;
  author: object;
  authorUsername: string;
  title: string;
  body: string;
  url: string;

  constructor(
    id: string,
    author: object,
    authorUsername: string,
    title: string,
    body: string,
    url: string
  ) {
    this.id = id;
    this.author = author;
    this.authorUsername = authorUsername;
    this.title = title;
    this.body = body;
    this.url = url;
  }
}

export { Article };
