// db.js
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: 'config.env' });

console.log("MongoDB URI:", process.env.MONGODB_URI);

const URI = process.env.MONGODB_URI || "";


const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// Export the database instance for use in other files
const db = client.db("mealPlannerDB"); // Change to your database name
export { connectToDatabase, db };