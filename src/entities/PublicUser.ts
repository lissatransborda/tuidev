import { Article } from "./Article";

class PublicUser {
  id: string;
  username: string;
  name: string;
  articles: Array<Article>;

  constructor(
    id: string,
    username: string,
    name: string,
    articles: Array<Article>
  ) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.articles = articles;
  }
}

export { PublicUser };
