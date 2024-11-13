import express from 'express';
import Survey from './mongoDataFormat.js';  // Import the Survey model

const router = express.Router();

// POST route to save survey and meal plan data
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

// GET route to retrieve all saved survey and meal plan entries
router.get('/history', async (req, res) => {
    try {
        const history = await Survey.find({}).sort({ createdAt: -1 });  // Retrieve all entries, sorted by newest
        res.status(200).json(history);
    } catch (error) {
        console.error('Error retrieving history data:', error);
        res.status(500).json({ message: 'Failed to retrieve history data' });
    }
});

// GET route to retrieve a specific meal plan by ID
router.get('/:id', async (req, res) => {
    try {
        const mealPlan = await Survey.findById(req.params.id);  // Find the survey by ID in MongoDB

        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        res.status(200).json(mealPlan.mealPlanData);  // Return the meal plan data
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).json({ message: 'Error fetching meal plan data' });
    }
});

export default router;
