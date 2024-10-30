import getPlan from './mealPlan/index';

// Submit survey data and meal plan data together
const submitSurvey = async (surveyData) => {
    try {
        // Generate the meal plan based on survey data
        const mealPlanData = await getPlan(surveyData);

        // Combine survey data and meal plan data
        const combinedData = {
            survey: surveyData,
            mealPlan: mealPlanData,
        };

        // Log the payload size before sending the request
        console.log('Payload Size (bytes):', new Blob([JSON.stringify(combinedData)]).size);

        // Send the combined data to the backend (POST Request)
        const response = await fetch('http://localhost:5000/api/survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(combinedData),
        });

        // Log response status and type
        console.log('Response Status:', response.status);

        // Handle successful JSON response
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            // Check content type to determine if it's JSON or HTML
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                // If JSON, parse the error response
                const errorData = await response.json();
                console.error('Backend JSON Error:', errorData);
                throw new Error(`Backend Error: ${errorData.message}`);
            } else {
                // If not JSON, it's likely an HTML error page
                const text = await response.text();
                console.error('Unexpected HTML Response:', text);
                throw new Error('Unexpected non-JSON response from the server.');
            }
        }
    } catch (error) {
        console.error('Error submitting survey and meal plan data:', error);
        alert(`Submission Error: ${error.message}`);
        throw error;
    }
};

export default submitSurvey;
