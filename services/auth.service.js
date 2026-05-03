import { getCollection } from "../config/db.js";

// GET USER BY EMAIL
export const findUserByEmail = async (email) => {
  const collection = getCollection("anyInformation");
  return await collection.findOne({ email });
};

// CREATE USER
export const createUser = async (userData) => {
  const collection = getCollection("anyInformation");
  return await collection.insertOne(userData);
};
