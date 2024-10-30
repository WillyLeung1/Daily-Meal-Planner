const express = require('express');
const router = express.Router();
const Survey = require('./models/Survey');  // Assuming a Survey model exists for MongoDB

// Handle POST request for combined survey and meal plan data
router.post('/submitData', async (req, res) => {
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

module.exports = router;
