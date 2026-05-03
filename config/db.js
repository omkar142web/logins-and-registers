// import { MongoClient } from "mongodb";

// const URI = "mongodb+srv://userNameOP:17102006om@cluster0.05uptec.mongodb.net/";
// const dbName = "contacts-api";

// let db;
// let collection;

// export const connectDB = async () => {
//   const client = new MongoClient(URI);
//   await client.connect();

//   db = client.db(dbName);
//   collection = db.collection("anyInformation");

//   console.log("🍃 MongoDB connected");
// };

// // export collection getter
// export const getCollection = () => {
//   if (!collection) {
//     throw new Error("DB not connected. Call connectDB first.");
//   }
//   return collection;
// };

// ======================================================

import { MongoClient } from "mongodb";

const URI = "mongodb+srv://userNameOP:17102006om@cluster0.05uptec.mongodb.net/";
const dbName = "contacts-api";

let db;

export const connectDB = async () => {
  try {
    // Check if already connected
    if (db) return; // already connected

    // Connect to MongoDB
    const client = new MongoClient(URI);
    await client.connect();

    db = client.db(dbName);

    console.log("🍃 MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

// export collection getter
export const getCollection = (collectionName = "anyInformation") => {
  if (!db) {
    throw new Error("DB not connected. Call connectDB first.");
  }
  return db.collection(collectionName);
};

// ======================================================
