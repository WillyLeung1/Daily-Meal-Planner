import dotenv from "dotenv";
dotenv.config({ path: 'server/config.env' });  // Ensure correct env file

import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db.js";  // Use the modified Mongoose connection
import surveyRoutes from "./survey.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Set payload limit
const payloadLimit = '200mb';
console.log(`Setting JSON payload limit to: ${payloadLimit}`);

// Middleware to handle larger payloads
app.use(cors());
app.use(express.json({ limit: payloadLimit }));

// Routes
app.use("/api/survey", surveyRoutes);

// Connect to MongoDB using Mongoose and start the server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    message: 'Internal server error',
    error: err.message || 'Unexpected error occurred',
  });
});

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
