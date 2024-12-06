import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import fetchHistory from '../utils/fetchHistory'; // Import fetchHistory to get meal plans
import Nav from './shared/Nav';
import './shared/Button/Button.css';

const HistoryTab = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();
    const [sortedState, setSortedState] = useState(true);

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

    if (loading) return (
        <div>Loading...</div>
    );

    if (error) return (
        <div>{error}</div>
    );

    const handleClick = (id, createdAt) => {
        // Go to the old meal plan with this ID (with date)
        history.push(`/meal-plan/${id}?date=${encodeURIComponent(new Date(createdAt).toLocaleDateString())}`);
    };

    // Sorting function
    const toggleSort = () => {
        setSortedState((prev) => !prev);
        setHistoryData((prevData) =>
            [...prevData].sort((a, b) =>
                sortedState
                    ? new Date(a.createdAt) - new Date(b.createdAt) // Oldest to recent
                    : new Date(b.createdAt) - new Date(a.createdAt) // Recent to oldest
            )
        );
    };

    // Calling delete function in API
    const deleteMealPlan = async (id) => {

        const response = await fetch(`http://localhost:5000/api/survey/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error: Cannot delete meal plan');
        }

        return response.json();
    };

    // Actually deleting using above function
    const handleDelete = async (id) => {
        try {
            await deleteMealPlan(id); 

            // Update state
            setHistoryData((prevData) => prevData.filter((plan) => plan._id !== id)); 
        } catch (err) {
            alert('Error deleting meal plan: ' + err.message);
        }
    };

    return (
        <div>
            <Nav />
            <h2>Meal History</h2>

            <button onClick={toggleSort} className="Button Button--transparent">
                Sort by: {sortedState ? "Oldest to Recent" : "Recent to Oldest"}
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {historyData.map((plan) => (
                    <div
                        key={plan._id}
                        style={{
                            width: '150px',
                            height: '200px',
                            border: '1px solid #ccc',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                        }}
                    >
                        <div onClick={() => handleClick(plan._id, plan.createdAt)}>
                            <p><strong>Date:</strong> {new Date(plan.createdAt).toLocaleDateString()}</p>
                            <p><strong>Plan:</strong> {plan.mealPlanData && plan.mealPlanData.summary ? plan.mealPlanData.summary : 'View Details'}</p>
                        </div>

                        {/* Delete button */}
                        <button
                            onClick={() => handleDelete(plan._id)}
                            style={{
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                        }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTab;
