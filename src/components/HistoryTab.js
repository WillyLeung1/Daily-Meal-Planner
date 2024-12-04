import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import fetchHistory from '../utils/fetchHistory'; // Import fetchHistory to get meal plans
import Nav from './shared/Nav';

const HistoryTab = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchMealPlans = async () => {
            try {
                const data = await fetchHistory();
                setHistoryData(data); // Store fetched meal plans
            } catch (err) {
                setError("Failed to load history data");
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, []);

    if (loading) return 
    <div>
        Loading...
    </div>;
    
    if (error) return 
    <div>
        {error}
    </div>;

    const handleClick = (id, createdAt) => {
        // Go to the old meal plan with this ID
        history.push(`/meal-plan/${id}
            ?date=${encodeURIComponent(new Date(createdAt).toLocaleDateString())}`); // Send date as well
    };

    return (
        <div>
            <Nav />
            <h2>Meal History</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {historyData.map((plan) => (
                    <div
                        key={plan._id}
                        onClick={() => handleClick(plan._id, plan.createdAt)} // Navigation icon
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
