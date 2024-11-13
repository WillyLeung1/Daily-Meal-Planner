import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import fetchHistory from '../utils/fetchHistory'; // Import fetchHistory to retrieve the meal plans

const HistoryTab = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory(); // Initialize useHistory hook

    useEffect(() => {
        // Fetch meal plans data from MongoDB using the fetchHistory utility
        const fetchMealPlans = async () => {
            try {
                const data = await fetchHistory();  // Call the fetchHistory function to get the data
                setHistoryData(data); // Store fetched meal plans in state
            } catch (err) {
                setError("Failed to load history data");
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleClick = (id) => {
        // Navigate to the full meal plan display page using the meal plan ID
        history.push(`/meal-plan/${id}`);
    };

    return (
        <div>
            <h2>Meal History</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {historyData.map((plan) => (
                    <div
                        key={plan._id}
                        onClick={() => handleClick(plan._id)}  // Click on the icon to view the full plan
                        style={{
                            width: '150px',
                            height: '150px',
                            border: '1px solid #ccc',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <p><strong>Date:</strong> {new Date(plan.createdAt).toLocaleDateString()}</p>
                        <p><strong>Plan:</strong> {plan.mealPlanData && plan.mealPlanData.summary ? plan.mealPlanData.summary : 'View Details'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTab;
