import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const MealPlanDisplay = () => {
    const { id } = useParams();
    const [mealPlanData, setMealPlanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);

    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/survey/${id}`);
                if (!response.ok) throw new Error('Failed to load meal plan data');
                const data = await response.json();

                console.log("Fetched data:", data);  // Log full fetched data to verify structure
                setMealPlanData(data);  // Directly set data as mealPlanData
            } catch (error) {
                console.error("Error fetching meal plan:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlan();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleDaySelection = (dayIndex) => {
        setSelectedDay(dayIndex);
    };

    return (
        <div className="meal-plan-container">
            <h2>Your Meal Plan</h2>

            {/* Render day-based navigation */}
            <div className="day-tabs">
                {[...Array(7)].map((_, dayIndex) => (
                    <button
                        key={dayIndex}
                        className={`day-tab ${dayIndex === selectedDay ? 'active' : ''}`}
                        onClick={() => handleDaySelection(dayIndex)}
                    >
                        Day {dayIndex + 1}
                    </button>
                ))}
            </div>

            {mealPlanData ? (
                <div className="meal-plan-grid">
                    {Object.keys(mealPlanData).map((mealType) => (
                        <div key={mealType} className="meal-type-column">
                            <h3>{mealType}</h3>
                            {console.log(`Data for ${mealType}:`, mealPlanData[mealType])}
                            {console.log(`Data for ${mealType} on Day ${selectedDay + 1}:`, mealPlanData[mealType][selectedDay])}

                            {/* Check if the day's data is an array or single object */}
                            {Array.isArray(mealPlanData[mealType][selectedDay]) ? (
                                mealPlanData[mealType][selectedDay].map((recipeWrapper, index) => (
                                    <div key={index} className="meal-card">
                                        <a 
                                            href={recipeWrapper.recipe.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="meal-card-link"
                                        >
                                            <img 
                                                src={recipeWrapper.recipe.image} 
                                                alt={recipeWrapper.recipe.label} 
                                                className="meal-card-image"
                                            />
                                            <h4 className="meal-card-title">{recipeWrapper.recipe.label}</h4>
                                        </a>
                                        <p className="meal-card-source">{recipeWrapper.recipe.source}</p>
                                        <div className="meal-card-tags">
                                            {recipeWrapper.recipe.dietLabels.map((label, i) => (
                                                <span key={i} className="meal-card-tag">{label}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                mealPlanData[mealType][selectedDay] && (
                                    <div className="meal-card">
                                        <a 
                                            href={mealPlanData[mealType][selectedDay].recipe.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="meal-card-link"
                                        >
                                            <img 
                                                src={mealPlanData[mealType][selectedDay].recipe.image} 
                                                alt={mealPlanData[mealType][selectedDay].recipe.label} 
                                                className="meal-card-image"
                                            />
                                            <h4 className="meal-card-title">{mealPlanData[mealType][selectedDay].recipe.label}</h4>
                                        </a>
                                        <p className="meal-card-source">{mealPlanData[mealType][selectedDay].recipe.source}</p>
                                        <div className="meal-card-tags">
                                            {mealPlanData[mealType][selectedDay].recipe.dietLabels.map((label, i) => (
                                                <span key={i} className="meal-card-tag">{label}</span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No meal plan data available.</p>
            )}
        </div>
    );
};

export default MealPlanDisplay;
