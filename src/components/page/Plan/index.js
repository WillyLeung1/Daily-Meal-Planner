

// Show calories and change meal
import React, { useState } from 'react';
import Meal from '../../shared/Meal';
import Tabs, { Tab } from '../../shared/Tabs';
import NotFound from '../../shared/NotFound';
import Nav from '../../shared/Nav';
import { fetchNewMeal } from '../../../utils/mealPlan'; // import fetchNewMeal
import './Plan.css';

const quickMealKeywords = ["salad", "wrap", "sandwich", "smoothie", "taco", "burger"];

// Generate content for single tag
const createContent = (heading, dataOb, index, userInputTime, replacedMeals, handleReplaceMeal) => {
  let contentArr = [];
  for (let mealType in dataOb) {
    let content = replacedMeals[index] && replacedMeals[index][mealType]
      ? replacedMeals[index][mealType]
      : dataOb[mealType][index];

    if (!content || !content.recipe) {
      console.warn(`Missing content or recipe for mealType: ${mealType}`);
      continue;
    }

    let recipe = content.recipe;

    if (!recipe.label) {
      console.warn('Recipe missing label:', recipe);
      continue;
    }

    const isQuickMeal = quickMealKeywords.some(keyword =>
      recipe.label.toLowerCase().includes(keyword)
    );

    const estimatedTime = isQuickMeal ? 20 : 30;

    if (userInputTime < estimatedTime) {
      continue;
    }

    contentArr.push({
      label: mealType,
      content: content,
      onReplace: () => handleReplaceMeal(index, mealType),
    });
  }

  return (
    <Tab heading={heading} key={`Tab__${index}`}>
      {contentArr.map((elem, i) => {
        let recipe = elem.content.recipe;
        let dietLabels = recipe.dietLabels ? recipe.dietLabels : {};
        let healthLabels = recipe.healthLabels ? recipe.healthLabels : {};
        return (
          <div className="Meal_Data" key={`Meal__${i}_${index}`}>
            <Meal
              type={elem.label}
              imgSrc={recipe.image || null}
              heading={recipe.label || null}
              source={recipe.source || null}
              tags={[...dietLabels, ...healthLabels]}
              url={recipe.url || "#"}
              onReplace={elem.onReplace}
            />
            {/* Show calories */}
            <p className="Calories">
              Calories: {recipe.calories ? recipe.calories.toFixed(2) : "Not Available"}
            </p>
          </div>
        );
      })}
    </Tab>
  );
};

// Generate Tabs
const createTabs = (count, data, userInputTime, replacedMeals, handleReplaceMeal) => {
  let tabs = [];
  for (let i = 0; i < count; i++) {
    let content = createContent(`Day ${i + 1}`, data, i, userInputTime, replacedMeals, handleReplaceMeal);
    tabs.push(content);
  }
  return (
    <Tabs defaultIndex={0} className="Plan__tabs">{tabs.map((tab) => tab)}</Tabs>
  );
};

const Plan = (props) => {
  const [replacedMeals, setReplacedMeals] = useState({});

  // Change meal
  const handleReplaceMeal = async (day, mealType) => {
    try {
      const newMeals = await fetchNewMeal(mealType);

      if (newMeals && newMeals.length > 0) {
        const randomIndex = Math.floor(Math.random() * newMeals.length);
        const newMeal = newMeals[randomIndex];

        // Update replacedMeals
        setReplacedMeals((prevState) => ({
          ...prevState,
          [day]: {
            ...prevState[day],
            [mealType]: { recipe: newMeal.recipe },
          },
        }));
      } else {
        console.warn("No new meals found, using default replacement.");
      }
    } catch (error) {
      console.error("Error replacing meal:", error);
    }
  };

  if (!props.location || !props.location.state || !props.location.state.data)
    return (
      <div>
        <Nav />
        <NotFound />
      </div>
    );

  let param = props.location.state.data;
  const userInputTime = param.cookingTime;

  return (
    <div className="Plan">
      <Nav />
      {createTabs(param.num, param.data, userInputTime, replacedMeals, handleReplaceMeal)}
    </div>
  );
};

export default Plan;
