import express from "express";
import {
  getHome,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", getHome);

router.route("/login").get(getLogin).post(postLogin);

router.route("/register").get(getRegister).post(postRegister);

router.get("/logout", logoutUser);

export default router;
