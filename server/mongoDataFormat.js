import mongoose from 'mongoose';

// Layout of data to send to MongoDB
const surveySchema = new mongoose.Schema({
    surveyData: { type: Object, required: true },
    mealPlanData: { type: Object, required: true },
    }, { timestamps: true }
);

const Survey = mongoose.model('Survey', surveySchema);

export default Survey;
