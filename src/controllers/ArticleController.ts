require("dotenv").config();
import { Request, Response } from "express";
import { ArticleService } from "../services/ArticleService";
import { UserService } from "../services/UserService";
import { Article } from "../entities/Article";
import { validateResult } from "../utils/validateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

const articleService = new ArticleService();
const userService = new UserService();

class ArticleController {
  async create(request: Request, response: Response) {
    const validation = validateResult(request);
    if (validation) {
      return response.status(400).send({ errors: validation });
    }

    const authorization = request.headers["authorization"];
    const articleData = request.body as Article;

    try {
      const jwtData = jwt.verify(authorization!, JWT_PRIVATE_KEY) as JwtPayload;

      if (jwtData.id != articleData.authorId) {
        return response
          .status(400)
          .send({ data: "userId and JWT are different" });
      }

      const author = await userService.getById(articleData.authorId);

      if (!author) {
        return response.status(404).json({ data: "the author doesn't exist" });
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

      return response.status(500);
    }
  }

  async update(request: Request, response: Response) {
    const validation = validateResult(request);
    if (validation) {
      return response.status(400).send({ errors: validation });
    }

    const authorization = request.headers["authorization"];

    try {
      jwt.verify(authorization!, JWT_PRIVATE_KEY);

      const articleData = request.body as Article;
      const id = request.params.id;

      const author = await userService.getById(articleData.authorId);

      if (!author) {
        return response.status(404).json({ data: "the author doesn't exist" });
      }

      articleData.url = `${author.username}/${articleData.title.replace(
        " ",
        "-"
      )}`;

      const article = await articleService.update(articleData, id);
      return response.status(200).json(article);
    } catch (error: any) {
      if (error.name == "JsonWebTokenError") {
        return response.status(400).json({ data: "malformed JsonWebToken" });
      }
      if ((error.meta.cause = "Record to update not found.")) {
        return response.status(404).json({ data: "article ID not found" });
      }

      return response.status(500);
    }
  }

  async getById(request: Request, response: Response): Promise<Response> {
    try {
      const article = await articleService.getById(request.params.id);

      if (!article) {
        return response.status(404).json({ data: "article not found" });
      }

      return response.status(200).json(article);
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
