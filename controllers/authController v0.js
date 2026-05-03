// Controller becomes clean in v1
// ! from ❌ BEFORE (bad)
const collection = getCollection();
const user = await collection.findOne({ email });

// ! to ✅ AFTER (pro)
import { findUserByEmail } from "../services/auth.service.js";

export const postLogin = async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send("User not found");
  }

  res.send(user);
};

// =======================================================

import { getCollection } from "../config/db.js";

// HOME
export const getHome = async (req, res) => {
  try {
    // const collection = req.collection;
    const collection = getCollection();

    if (!req.cookies.email || !req.cookies.password) {
      return res.redirect("/login");
    }

    const user = await collection.findOne({
      email: req.cookies.email,
    });

    if (!user) {
      res.clearCookie("name");
      res.clearCookie("email");
      res.clearCookie("password");

      return res.send(`User not found. <a href="/register">Register</a>`);
    }

    if (user.password === req.cookies.password) {
      return res.send(`
        <h1>Welcome back, ${user.name} 👋</h1>
        <p>Email: ${user.email}</p>
        <a href="/logout">Logout</a>
      `);
    }

    res.clearCookie("name");
    res.clearCookie("email");
    res.clearCookie("password");

    return res.send(`Invalid credentials. <a href="/login">Login</a>`);
  } catch (err) {
    console.log("Home error ❌", err);
    res.status(500).send("Internal Server Error");
  }
};

// LOGIN GET
export const getLogin = async (req, res) => {
  try {
    // const collection = req.collection;
    const collection = getCollection();

    if (!req.cookies.email || !req.cookies.password) {
      return res.render("login");
    }

    const user = await collection.findOne({
      email: req.cookies.email,
    });

    if (!user || user.password !== req.cookies.password) {
      res.clearCookie("name");
      res.clearCookie("email");
      res.clearCookie("password");

      return res.render("login");
    }

    return res.redirect("/");
  } catch (err) {
    console.log("Login GET error ❌", err);
    res.status(500).send("Internal Server Error");
  }
};

// LOGIN POST
export const postLogin = async (req, res) => {
  try {
    // const collection = req.collection;
    const collection = getCollection();
    const { email, password } = req.body;

    const user = await collection.findOne({ email });

    if (!user) {
      return res.send(`User not found! <a href="/register">Register</a>`);
    }

    if (user.password !== password) {
      return res.send(`Wrong password! <a href="/login">Try again</a>`);
    }

    res.cookie("name", user.name, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie("email", user.email, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie("password", user.password, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.redirect("/");
  } catch (err) {
    console.log("Login POST error ❌", err);
    res.status(500).send("Internal Server Error");
  }
};

// REGISTER GET
export const getRegister = (req, res) => {
  res.render("register");
};

// REGISTER POST
export const postRegister = async (req, res) => {
  try {
    // const collection = req.collection;
    const collection = getCollection();
    const { name, email, password } = req.body;

    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.send(`Email already exists! <a href="/login">Login</a>`);
    }

    await collection.insertOne({ name, email, password });

    res.cookie("name", name, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    res.cookie("email", email, { maxAge: 1000 * 60 * 60 * 24 * 365 });
    res.cookie("password", password, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return res.redirect("/");
  } catch (err) {
    console.log("Register POST error ❌", err);
    res.status(500).send("Internal Server Error");
  }
};

// LOGOUT
export const logoutUser = (req, res) => {
  res.clearCookie("name");
  res.clearCookie("email");
  res.clearCookie("password");

  res.redirect("/login");
};
