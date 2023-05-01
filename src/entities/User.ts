import { Article } from "./Article";

class User {
  id: string;
  username: string;
  password: string;
  name: string;
  articles: Array<Article>;

  constructor(
    id: string,
    username: string,
    password: string,
    name: string,
    articles: Array<Article>
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.articles = articles;
  }
}

export { User };
