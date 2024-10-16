// server.js
import dotenv from "dotenv";
dotenv.config({ path: 'config.env' });

console.log("MongoDB URI:", process.env.MONGODB_URI);

import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db.js"; // Import database connection
import surveyRoutes from "./survey.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

// Routes
app.use("/api/survey", surveyRoutes); // Survey routes