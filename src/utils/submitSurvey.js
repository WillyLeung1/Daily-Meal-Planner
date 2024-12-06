import getPlan from './mealPlan/index';

// Submit survey and meal plan data together
const submitSurvey = async (surveyData) => {
    try {
        const mealPlanData = await getPlan(surveyData);

        // Combine survey and meal plan data
        const combinedData = {
            survey: surveyData,
            mealPlan: mealPlanData,
        };

        // Log payload size (debugging)
        console.log('Payload Size (bytes):', new Blob([JSON.stringify(combinedData)]).size);

        // Send data to the backend (POST Request)
        const response = await fetch('http://localhost:5000/api/survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(combinedData),
        });

        console.log('Response Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            
            // Checking contents (JSON or not, debugging)
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('Backend JSON Error:', errorData);
                throw new Error(`Backend Error: ${errorData.message}`);
            } else {

                const text = await response.text();
                console.error('Unexpected HTML Response:', text);
                throw new Error('Unexpected non-JSON response from the server.');
            }
        }
    } catch (error) {
        console.error('Error submitting survey and meal plan data:', error);
        alert(`Error: ${error.message}`);
        throw error;
    }
};

export default submitSurvey;
