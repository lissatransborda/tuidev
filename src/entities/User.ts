import { Article } from "./Article";

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  articles?: Array<Article>;

  created_at?: Date;
  updated_at?: Date;
}
