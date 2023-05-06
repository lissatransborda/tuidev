import { Article } from "./Article";

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  articles?: Array<Article>;
}
