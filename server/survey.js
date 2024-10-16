// survey.js
import express from "express";
import { db } from "./db.js"; // Import db instance

const router = express.Router();

// Route to save survey data
router.post("/", async (req, res) => {
  try {
    const collection = db.collection("surveys");
    const result = await collection.insertOne(req.body);
    res.status(201).json({ message: "Survey data saved", result });
  } catch (error) {
    console.error("Error saving survey data:", error);
    res.status(500).json({ message: "Error saving survey data" });
  }
});

export default router;