import { Router } from "express";

import { UserController } from "./controllers/UserController";
import { ArticleController } from "./controllers/ArticleController";
import { LoginController } from "./controllers/LoginController";

const router = Router();

const userController = new UserController();
const articleController = new ArticleController();
const loginController = new LoginController();

router.get("/user", userController.getAll);
router.get("/user/:username", userController.getByUsername);
router.post("/user", userController.create);

router.post("/login", loginController.login);

router.get("/article", articleController.getAll);
router.get("/article/:id", articleController.getById);
router.post("/article", articleController.create);

export { router };
