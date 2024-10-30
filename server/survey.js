import express from 'express';
import Survey from './mongoDataFormat.js';  // Import the renamed model

const router = express.Router();

// Handle POST request for combined survey and meal plan data
router.post('/', async (req, res) => {
    try {
        const { survey, mealPlan } = req.body;

        // Create a document with survey and meal plan data
        const surveyEntry = new Survey({
            surveyData: survey,
            mealPlanData: mealPlan,
        });

        // Save to MongoDB
        await surveyEntry.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Failed to save data' });
    }
});

export default router;
