import { Request, Response } from "express";
import { UserService } from "../services/UserService";

import { User } from "../entities/User";

const userService = new UserService();

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const userData = request.body as User;
      const user = await userService.create(userData);

      return response.status(200).json(user);
    } catch (error: any) {
      if ((error.code = "P2002")) {
        return response.status(400).json({ data: "username alredy exists" });
      }

      return response.status(500);
    }
  }

  async getByUsername(request: Request, response: Response): Promise<Response> {
    try {
      return response
        .status(200)
        .json(await userService.getByUsername(request.params.username));
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
