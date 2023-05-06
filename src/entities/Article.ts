import { User } from "./User";

export interface Article {
  id: string;
  author: User;
  authorId: string;
  title: string;
  body: string;
  url: string;
}
