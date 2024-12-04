// creating temporary file to store data manually before backend is created;
const surveyData = {
  selectOpt: {
    mealCount: [{ val: 3, text: "Three" }, { val: 5, text: "Five" }, { val: 2, text: "Two" }],
    planType: [
      { val: 7, text: "Weekly" },
      { val: 1, text: "Daily" },
      { val: 6, text: "Custom Plan" }, // 6 is an arbitrary value, look at src/components/page/Survey/index.js
    ],
  },
  dietSpec: [
    { name: "balanced", text: "Balanced Diet (Recommended)" },
    { name: "low-carb", text: "Low-Carb (Less than 20% of total calories from carbs)" },
    { name: "low-fat", text: "Low-Fat (Less than 15% of total calories from fat)" },
  ],
  healthSpec: [
    { name: "vegan", text: "Vegan (No meat, poultry, fish, dairy, eggs or honey)" },
    { name: "vegetarian", text: "Vegetarian (No wheat, can have gluten though)" },
    { name: "alcohol-free", text: "Alcohol-free (No alcohol used or contained)" },
    { name: "peanut-free", text: "Peanut Free (No peanuts or products containing peanuts)" },
  ],
  mealTypes: {
    3: ["Breakfast", "Lunch", "Dinner"],
    5: ["Breakfast Snack", "Breakfast", "Lunch", "Afternoon Snack", "Dinner"],
    2: ["Brunch", "Dinner"],
  },
  calories: {
    min: 1800,
    max: 2500,
  },
  cookingTime: {
    min: 15, // Adjusted to match the validation in Survey.js
    max: 999, // Adjusted to match the validation in Survey.js
  },
};
const API = {
  ID : "0da8a011",
  KEY : "80d1a4b2bb32f1c3fc29930c9154cbcb",
  URL : "https://api.edamam.com/search?",
};

export { surveyData as Survey, API };


