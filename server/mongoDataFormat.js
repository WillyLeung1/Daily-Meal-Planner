import mongoose from 'mongoose';

// Define the schema for survey and meal plan data
const surveySchema = new mongoose.Schema({
    surveyData: { type: Object, required: true },
    mealPlanData: { type: Object, required: true },
    }, { timestamps: true }
);

// Export the model using ES Module syntax
const Survey = mongoose.model('Survey', surveySchema);

export default Survey;
