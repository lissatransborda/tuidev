import { Request, Response } from "express";
import { LoginService } from "../services/LoginService";
import { validateResult } from "../utils/validateRequest";
import { Login } from "../entities/Login";

const loginService = new LoginService();

class LoginController {
  async login(request: Request, response: Response) {
    const validation = validateResult(request);
    if (validation) {
      return response.status(400).send({ errors: validation });
    }

    const loginData = request.body as Login;

    const login = await loginService.login(loginData);

    if (!login) {
      return response
        .status(400)
        .json({ data: "username or password are wrong" });
    }
    return response.status(200).json({ data: login });
  }
}

export { LoginController };
