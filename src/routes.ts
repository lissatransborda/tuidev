import { Router } from "express";

import { UserController } from "./controllers/UserController";
import { ArticleController } from "./controllers/ArticleController";
import { LoginController } from "./controllers/LoginController";
import { body, header } from "express-validator";

const router = Router();

const userController = new UserController();
const articleController = new ArticleController();
const loginController = new LoginController();

router.get("/user", userController.getAll);
router.get("/user/:username", userController.getByUsername);
router.post(
  "/user",
  body("username").notEmpty().isString().escape(),
  body("password").notEmpty().isString(),
  body("name").notEmpty().isString().escape(),
  userController.create
);

router.post(
  "/login",
  body("username").notEmpty().isString().escape(),
  body("password").notEmpty().isString(),
  loginController.login
);

router.get("/article", articleController.getAll);
router.get("/article/:id", articleController.getById);
router.post(
  "/article",
  body("title").notEmpty().isString().escape(),
  body("authorId").notEmpty().isUUID(),
  body("body").notEmpty().isString().escape(),
  header("authorization").notEmpty().isJWT(),
  articleController.create
);

export { router };
