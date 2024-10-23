import React from 'react';
import Meal from '../../shared/Meal';
import Tabs, {Tab} from '../../shared/Tabs';
import NotFound from '../../shared/NotFound';
import Nav from '../../shared/Nav';

import './Plan.css';

// Define keywords for dishes that are completed quickly (Jordan)
const quickMealKeywords = ["salad", "wrap", "sandwich", "smoothie", "taco", "burger"];

// Create a content function to generate the content for each tab and set the time based on keywords (Jordan)
const createContent = (heading, dataOb, index, userInputTime) => {
  let contentArr = [];
  for(let mealType in dataOb){
    let content = dataOb[mealType][index];
    if(content){
      let recipe = content.recipe;

      // Check if the recipe title contains quick-complete keywords
      const isQuickMeal = quickMealKeywords.some(keyword => 
        recipe.label.toLowerCase().includes(keyword)
      );

      // set estimate cooking time
      const estimatedTime = isQuickMeal ? 20 : 30;

      // If the time entered by the user is less than the estimatedTime, the recipe is filtered out
      if (userInputTime < estimatedTime) {
        continue;
      }

      contentArr.push({label:mealType,content:content})
    }
  }
  return (
    <Tab heading =  { heading } key={`Tab__${index}`} >
      {
        contentArr.map((elem,i) => {
          let recipe = elem.content.recipe;
          let dietLabels = recipe.dietLabels ? recipe.dietLabels : {};
          let healthLabels =  recipe.healthLabels ? recipe.healthLabels : {};

          return (
            <Meal type={elem.label}
                  imgSrc={ recipe.image ? recipe.image : null }
                  heading={ recipe.label ? recipe.label : null }
                  source={ recipe.source ? recipe.source : null }
                  tags={[...dietLabels, ...healthLabels]}
                  url={ recipe.url ? recipe.url : "#"}
                  key={`Meal__${i}_${index}`}
            />
          )
        })
      }
    </Tab>
  )
}

// Generate the corresponding number of tabs according to the number of days 
// and pass in the cooking time entered by the user (Jordan)
const createTabs = (count, data, userInputTime) => {
  let tabs = [];
  for(let i=0;i<count;i++){
    let content = createContent(`Day ${i+1}`, data, i);
    tabs.push(content)
  }
  return (
    <Tabs defaultIndex={0} className="Plan__tabs" >{tabs.map((tab) => tab)}</Tabs>
  )
}

const Plan = (props) => {
  if(!props.location || !props.location.state || !props.location.state.data) return (
    <div>
      <Nav />
      <NotFound />
    </div>
  )
  let param = props.location.state.data;
  const userInputTime = param.cookingTime; // Get user's input estimate time (Jordan)

  return(
    <div className="Plan">
      <Nav />
      {createTabs(param.num, param.data, userInputTime)} {/* Pass in the user input time to create the tab */}
    </div>
  )
}

export default Plan;
