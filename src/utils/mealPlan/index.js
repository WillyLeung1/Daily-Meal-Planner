
// change meal
import { getAPIData } from '../data';

// Fetch new meal data based on criteria
export const fetchNewMeal = async (criteria) => {
  try {
    const { ID, KEY, URL } = getAPIData();
    const query = `q=${criteria}&app_id=${ID}&app_key=${KEY}`;
    const response = await fetch(URL + query);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error("Error fetching new meal:", error);
    return [];
  }
};


// Function to generate meal plan
const getPlan = (data) => {
  const { ID, KEY, URL } = getAPIData();
  const queryObj = buildQuery(data, ID, KEY);
  const promises = [];
  const result = {};

  for (let key in queryObj) {
    const queryString = encodeURI(URL + queryObj[key]);
    promises.push(
      fetch(queryString)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch plan data for ${key}`);
          }
          return res.json();
        })
        .then((data) => {
          result[key] = data.hits;
        })
        .catch((err) => console.error("Error fetching plan data:", err))
    );
  }

  return Promise.all(promises).then(() => result);
};

// Helper function to build query strings for each meal type
const buildQuery = (data, ID, KEY) => {
  if (!data.plan || !data.meals || !data.calories || !data.diet) {
    return false;
  }

  const type = parseInt(data.plan, 10);
  const count = data.meals.length;
  const calories = {
    min: Math.round(parseInt(data.calories.min, 10) / count),
    max: Math.round(parseInt(data.calories.max, 10) / count),
  };

  let health = "";
  if (data.health) {
    health = stitch(data.health, "health");
  }

  const labelArr = data.meals;
  const queries = {};

  for (let i = 0; i < count; i++) {
    const str = labelArr[i];
    const query = `q=${str}&app_id=${ID}&app_key=${KEY}&to=${type}&diet=${data.diet}${health}&calories=${calories.min}-${calories.max}`;
    queries[str] = query;
  }
  return queries;
};

// Helper function to concatenate health filters
const stitch = (ob, label) => {
  let res = "&";
  for (let key in ob) {
    if (ob[key].toString() === "true") {
      res += `${label}=${key}&`;
    }
  }
  return res.slice(0, -1);
};

export default getPlan;
