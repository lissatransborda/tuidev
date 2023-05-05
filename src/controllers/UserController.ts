require("dotenv").config();
import { Request, Response } from "express";
import { UserService } from "../services/UserService";

import { User } from "../entities/User";
import { validationResult } from "express-validator";
import { validateResult } from "../utils/validateRequest";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "default";

const userService = new UserService();

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const validation = validateResult(request);
    if (validation) {
      return response.status(400).send({ errors: validation });
    }

    try {
      const userData = request.body as User;
      const user = await userService.create(userData);

      return response.status(200).json(user);
    } catch (error: any) {
      if ((error.meta.target = ["username"])) {
        return response.status(400).json({ data: "username alredy exists" });
      }

      return response.status(500);
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    const validation = validateResult(request);
    if (validation) {
      return response.status(400).send({ errors: validation });
    }

    const authorization = request.headers["authorization"];
      const userData = request.body as User;
      const id = request.params.id;

    try {
      const jwtData = jwt.verify(authorization!, JWT_PRIVATE_KEY) as JwtPayload;

      if (jwtData.id != id) {
        return response
          .status(400)
          .send({ data: "userId and JWT are different" });
      }

      const user = await userService.update(userData, id);

      return response.status(200).json(user);
    } catch (error: any) {
      if (error.name == "JsonWebTokenError") {
        return response.status(400).json({ data: "malformed JsonWebToken" });
      }
      if (error.meta.cause = "'Record to update not found.'") {
        return response.status(400).json({ data: "user ID not found" });
      }
      return response.status(500);
    }
  }

  async changePassword(
    request: Request,
    response: Response
  ): Promise<Response> {
    const validation = validateResult(request);
    if (validation) {
      return response.status(400).send({ errors: validation });
    }

    const authorization = request.headers["authorization"];
    const password = request.body.password;
    const id = request.params.id;

    try {
      const jwtData = jwt.verify(authorization!, JWT_PRIVATE_KEY) as JwtPayload;

      if (jwtData.id != id) {
        return response
          .status(400)
          .send({ data: "userId and JWT are different" });
      }

      const result = await userService.changePassword(password, id);

      return response.status(200).json(result);
    } catch (error: any) {
      if (error.name == "JsonWebTokenError") {
        return response.status(400).json({ data: "malformed JsonWebToken" });
      }
      if ((error.meta.cause = "Record to update not found.")) {
        return response.status(400).json({ data: "user ID not found" });
      }
      return response.status(500);
    }
  }

  async getByUsername(request: Request, response: Response): Promise<Response> {
    try {
      const user = await userService.getByUsername(request.params.username);

      if (!user) {
        return response.status(400).json({ data: "username not found" });
      }
      return response.status(200).json(user);
    } catch (error) {
      return response.status(500).json(error);
    }
  }

  async getAll(request: Request, response: Response): Promise<Response> {
    try {
      const users = await userService.getAll();
      return response.status(200).json(users);
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}

export { UserController };
