import dotenv from "dotenv";
dotenv.config({ path: 'server/config.env' });  // Load from the server directory

import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db.js";
import surveyRoutes from "./survey.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle larger payloads with logging
const jsonParser = express.json({ limit: '200mb' });

app.use((req, res, next) => {
    console.log('JSON payload limit set to:', jsonParser.limit);  // Log the set limit
    next();
});

app.use(cors());
app.use(jsonParser);  // Apply the JSON middleware with increased limit

// Routes
app.use("/api/survey", surveyRoutes);  // Survey routes

// Connect to MongoDB and start the server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Error handling middleware for better logging
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ message: err.message });
});