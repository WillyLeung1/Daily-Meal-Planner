const fetchHistory = async () => {
    try {
        // Connect to back-end for GET requests
        const response = await fetch('http://localhost:5000/api/survey/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);  // Log fetched data (debugging)
        return data;
    } catch (error) {
        console.error('Error fetching history data:', error);
        throw error;
    }
};

export default fetchHistory;