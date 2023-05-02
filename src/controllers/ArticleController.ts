require("dotenv").config();
import { Request, Response } from "express";
import { ArticleService } from "../services/ArticleService";
import { UserService } from "../services/UserService";
import { Article } from "../entities/Article";
import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

const articleService = new ArticleService();
const userService = new UserService();

class ArticleController {
  async create(request: Request, response: Response) {
    const authorization = request.headers["authorization"];

    if (!authorization) {
      return response
        .status(400)
        .json({ data: "please insert authorization header" });
    }

    try {
      jwt.verify(authorization, JWT_PRIVATE_KEY);

      const articleData = request.body as Article;

      const author = await userService.getById(articleData.authorId);

      if (!author) {
        return response.status(400).json({ data: "the author doesn't exist" });
      }

      articleData.url = `${author.username}/${articleData.title.replace(
        " ",
        "-"
      )}`;

      const article = await articleService.create(articleData);
      return response.status(200).json(article);
    } catch (error: any) {
      if (error.name == "JsonWebTokenError") {
        return response.status(400).json({ data: "malformed JsonWebToken" });
      }
    }
  }

  async getById(request: Request, response: Response): Promise<Response> {
    try {
      return response
        .status(200)
        .json(await articleService.getById(request.params.id));
    } catch (error) {
      return response.status(500).json(error);
    }
  }

  async getAll(request: Request, response: Response): Promise<Response> {
    try {
      const users = await articleService.getAll();
      return response.status(200).json(users);
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}

export { ArticleController };
