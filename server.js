import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

// ! mongo setup..
import { MongoClient, MongoClientClosedError } from "mongodb";
const dbname = "contacts-api";
const URI = "mongodb+srv://userNameOP:17102006om@cluster0.05uptec.mongodb.net/";
const client = new MongoClient(URI);

await client.connect();
console.log(`🍃 Database connected: ${dbname}`);
const actualldb = client.db(dbname);
const actalcollection = actualldb.collection("anyInformation");

const collData = await actalcollection.find().toArray();
console.log(collData);

// ! cookies section
import cookieParser from "cookie-parser";
app.use(cookieParser());

// ! home page..
app.get("/", async (req, res) => {
  try {
    // No login cookie
    if (!req.cookies.email || !req.cookies.password) {
      console.log("No cookies found ❌");
      return res.redirect("/login");
    }

    // Find user in DB
    const user = await actalcollection.findOne({
      email: req.cookies.email,
    });

    console.log("Home DB user:", user);

    // User not found
    if (!user) {
      console.log("User not found in DB ❌");

      res.clearCookie("name");
      res.clearCookie("email");
      res.clearCookie("password");

      return res.send(
        `User not found in database. <a href="/register">Register</a>`,
      );
    }

    // Password match
    if (user.password === req.cookies.password) {
      console.log("User authenticated ✅");

      return res.send(`
        <h1>Welcome back, ${user.name} 👋</h1>
        <p>Email: ${user.email}</p>
        <a href="/logout">Logout</a>
      `);
    }

    // Password mismatch
    console.log("Password mismatch ❌");

    res.clearCookie("name");
    res.clearCookie("email");
    res.clearCookie("password");

    return res.send(`Invalid credentials. <a href="/login">Login Again</a>`);
  } catch (err) {
    console.log("Home route error ❌", err);
    res.status(500).send("Internal Server Error");
  }
});

// ! login..
app.get("/login", async (req, res) => {
  try {
    console.log("cookies email -", req.cookies.email);

    // No cookies
    if (!req.cookies.email || !req.cookies.password) {
      console.log("cookies NOT found ❌");
      return res.render("login");
    }

    // Find user
    const user = await actalcollection.findOne({
      email: req.cookies.email,
    });

    if (!user) {
      console.log("DB user NOT found ❌");

      res.clearCookie("name");
      res.clearCookie("email");
      res.clearCookie("password");

      return res.render("login");
    }

    // Valid login
    if (user.password === req.cookies.password) {
      console.log("cookies found ✅");
      return res.redirect("/");
    }

    // Wrong password
    console.log("password mismatch ❌");

    res.clearCookie("name");
    res.clearCookie("email");
    res.clearCookie("password");

    res.render("login");
  } catch (err) {
    console.log("Login GET error ❌", err);
    res.status(500).send("Internal Server Error");
  }
});

// ! login post..
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await actalcollection.findOne({ email });

    // User not found
    if (!user) {
      console.log("after login email NOT found ❌");

      return res.send(
        `User not found! <a href="/register">Register Now</a> -- or -- <a href="/login">Login Again</a>`,
      );
    }

    // Wrong password
    if (user.password !== password) {
      console.log("Wrong password ❌");

      return res.send(`Wrong password! <a href="/login">Try Again</a>`);
    }

    // Correct login → set cookies
    res.cookie("name", user.name, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie("email", user.email, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.cookie("password", user.password, { maxAge: 1000 * 60 * 60 * 24 * 30 });

    console.log("after login success ✅");

    return res.redirect("/");
  } catch (err) {
    console.log("Login POST error ❌", err);
    res.status(500).send("Internal Server Error");
  }
});

// ! registering..
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Register data:", req.body);

    // Check existing user
    const existingUser = await actalcollection.findOne({ email });

    if (existingUser) {
      console.log("User already exists ⚠️");

      return res.send(`Email already registered! <a href="/login">Login</a>`);
    }

    // Save to DB
    const result = await actalcollection.insertOne({
      name,
      email,
      password,
    });

    console.log("saved to db 🔥", result);

    // Set cookies
    res.cookie("name", name, { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 });
    res.cookie("email", email, { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 });
    res.cookie("password", password, {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    });

    return res.redirect("/");
  } catch (err) {
    console.log("Register POST error ❌", err);
    res.status(500).send("Internal Server Error");
  }
});

// ! logout..
app.get("/logout", (req, res) => {
  res.clearCookie("name");
  res.clearCookie("email");
  res.clearCookie("password");

  console.log("Logged out ✅");

  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(
    `Servering running on port ${PORT}, visit http://localhost:${PORT}`,
  );
});

