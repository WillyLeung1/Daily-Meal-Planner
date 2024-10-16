// server.js
import dotenv from "dotenv";
dotenv.config({ path: 'config.env' });

import express from "express";
import cors from "cors"; // Import CORS middleware
import { connectToDatabase } from "./db.js"; // Assuming this connects to MongoDB
import surveyRoutes from "./survey.js"; // Assuming this handles /api/survey routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your frontend port (adjust if needed)
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB and start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

// Routes
app.use("/api/survey", surveyRoutes); // Survey route to handle survey data submissions

export default app;