import { Request, Response } from "express";
import { Login } from "../entities/Login";
import { LoginService } from "../services/LoginService";

const loginService = new LoginService();

class LoginController {
  async login(request: Request, response: Response) {
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
