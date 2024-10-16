// POST Request
export const submitSurvey = async (surveyData) => {
    try {
      const response = await fetch("http://localhost:5000/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(surveyData)
      });
      const data = await response.json();
      console.log("Survey submitted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error submitting survey:", error);
      throw error;
    }
  };