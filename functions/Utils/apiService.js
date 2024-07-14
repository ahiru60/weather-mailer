const axios = require('axios');

async function fetchData(uri) {
    try {
        const response = await axios.get(uri);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return(error);
    }
}

module.exports = fetchData;
