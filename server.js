import express from "express";
import cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(cookieParser());

// ! MongoDB setup v0
// const dbname = "contacts-api";
// const URI = "mongodb+srv://userNameOP:17102006om@cluster0.05uptec.mongodb.net/";

// const client = new MongoClient(URI);
// await client.connect();

// console.log(`🍃 Database connected: ${dbname}`);
// const actualDb = client.db(dbname);
// const actualCollection = actualDb.collection("anyInformation");

// // make collection available in req
// app.use((req, res, next) => {
//   req.collection = actualCollection;
//   next();
// });

// ! MongoDB setup v1
import { connectDB } from "./config/db.js";
await connectDB();

//! routes
app.use("/", authRoutes);

//! server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
