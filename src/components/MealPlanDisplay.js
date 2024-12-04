import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './MealPlanDisplay.css'; // Willy's css

const MealPlanDisplay = () => {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date'); // Get date

    const [mealPlanData, setMealPlanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0); // Default to Day 1

    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/survey/${id}`);
                if (!response.ok) throw new Error('Failed to load meal plan');
                const data = await response.json();
                setMealPlanData(data); // Store the meal plan
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlan();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleDaySelection = (dayIndex) => {
        setSelectedDay(dayIndex); // Switch days
    };

    

// Needed to replace unnecessary days in display
const actualDays = mealPlanData ? Object.keys(mealPlanData[Object.keys(mealPlanData)[0]]).length : 0;

return (
    <div className="meal-stuff">

        <h2>Your Meal Plan on {date}</h2>

        {/* Tabs for each day */}
        <div className="days-row">
            {[...Array(actualDays)].map((_, dayIndex) => ( // Render only on selected days
                <button
                    key={dayIndex}
                    className={`day-box ${dayIndex === selectedDay ? 'selected-day' : ''}`}
                    onClick={() => setSelectedDay(dayIndex)}
                >
                    Day {dayIndex + 1}
                </button>
            ))}
        </div>

        {/* Render each meal */}
        {mealPlanData ? (
            <div className="grid-for-meals">
                {Object.keys(mealPlanData).map((mealType) => (
                    <div key={mealType} className="meal-type">

                        <h3>{mealType}</h3>

                        {mealPlanData[mealType][selectedDay] ? (
                            <div className="meal-item">

                                {/* Image and tags logic */}
                                <a
                                    href={mealPlanData[mealType][selectedDay].recipe.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="meal-link"
                                >
                                    <img
                                        src={mealPlanData[mealType][selectedDay].recipe.image}
                                        alt={mealPlanData[mealType][selectedDay].recipe.label}
                                        className="meal-pic"
                                    />

                                    {/* Show calories */}
                                    <p className = "Calories">
                                        Calories: {mealPlanData[mealType][selectedDay].recipe.calories 
                                        ? mealPlanData[mealType][selectedDay].recipe.calories.toFixed(2) : "N/A"}
                                    </p>

                                    <h4 className="meal-title">{mealPlanData[mealType][selectedDay].recipe.label}</h4>
                                </a>

                                <p className="meal-source">
                                    {mealPlanData[mealType][selectedDay].recipe.source}
                                </p>

                                <div className="tags-box">
                                    {mealPlanData[mealType][selectedDay].recipe.dietLabels.map((label, i) => (
                                        <span key={i} className="tag">{label}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>
                                No meals for today. 
                            </p> // If a day is missing meals, show this
                        )}
                    </div>
                ))}
            </div>
        ) : ( 
            <p> 
                No meal plan data available. 
            </p> // If the entire plan is missing meals
        )}
    </div>
    );
}

export default MealPlanDisplay;