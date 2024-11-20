import React from 'react';
import Meal from '../../shared/Meal';
import Tabs, { Tab } from '../../shared/Tabs';
import NotFound from '../../shared/NotFound';
import Nav from '../../shared/Nav';
import './Plan.css';

const createContent = (heading, dataOb, index) => {
  let contentArr = [];
  for (let mealType in dataOb) {
    console.log('Checking mealType:', mealType); // Log each mealType being checked
    if (dataOb.hasOwnProperty(mealType)) { // Use hasOwnProperty to check if the property exists
      if (Array.isArray(dataOb[mealType]) && dataOb[mealType].length > index) {
        const content = dataOb[mealType][index];
        if (content) {
          contentArr.push({ label: mealType, content: content });
        } else {
          console.warn(`Warning: No content for mealType '${mealType}' at index ${index}`);
        }
      } else {
        console.warn(`Warning: mealType '${mealType}' is either undefined or not an array, or doesn't have enough items.`);
      }
    } else {
      console.warn(`Warning: mealType '${mealType}' is undefined`);
    }
  }
  return (
    <Tab heading={heading} key={`Tab__${index}`}>
      {
        contentArr.map((elem, i) => {
          const recipe = elem.content.recipe;
          const dietLabels = recipe.dietLabels || [];
          const healthLabels = recipe.healthLabels || [];

          return (
            <Meal
              type={elem.label}
              imgSrc={recipe.image || null}
              heading={recipe.label || null}
              source={recipe.source || null}
              tags={[...dietLabels, ...healthLabels]}
              url={recipe.url || "#"}
              key={`Meal__${i}_${index}`}
            />
          );
        })
      }
    </Tab>
  );
};

const createTabs = (count, data) => {
  let tabs = [];
  const keys = Object.keys(data);

  if (keys.length > 0) {
    // Check if the first key leads to an array
    const firstKeyData = data[keys[0]];
    if (Array.isArray(firstKeyData)) {
      const numDays = Math.min(count, firstKeyData.length); // Get the minimum of count and available data
      console.log('Number of Days:', numDays); // Log the number of days being created

      for (let i = 0; i < numDays; i++) {
        let content = createContent(`Day ${i + 1}`, data, i);
        tabs.push(content);
      }
    } else {
      console.warn(`Warning: Data under '${keys[0]}' is not an array.`);
    }
  } else {
    console.warn('Warning: No valid keys found in data or data is not an array.');
  }

  return (
    <Tabs defaultIndex={0} className="Plan__tabs">{tabs.map((tab) => tab)}</Tabs>
  );
};

const Plan = (props) => {
  if (!props.location || !props.location.state || !props.location.state.data) {
    return (
      <div>
        <Nav />
        <NotFound />
      </div>
    );
  }

  let param = props.location.state.data;

  // Check for valid num and data structure
  console.log('Plan parameters:', param);
  console.log('Meal data:', JSON.stringify(param.data, null, 2)); // Log the actual data being passed

  // Validate param data structure
  if (!param.data || typeof param.data !== 'object') {
    console.error('Error: Invalid data structure received for meals.');
    return <NotFound />;
  }

  return (
    <div className="Plan">
      <Nav />
      {createTabs(param.num, param.data)}
    </div>
  );
};

export default Plan;
