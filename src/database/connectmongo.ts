import * as mongo from "mongodb";
import { config } from "dotenv";
import { error } from "console";
config();

const connectionString: string = process.env.MONGO_URL || "";

const mongoClient = new mongo.MongoClient(connectionString);
//Get a client

export async function createDB() {
  let conn;

  try {
    conn = (await mongoClient.connect()) as mongo.MongoClient;
    const timeZoneDB = conn.db("time-zone");
    return { error: false, timeZoneDB, mongoClient };
  } catch (error) {
    console.error(error);
    return { error: true, message: error };
  }
}
