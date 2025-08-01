const address = async (streetAddress, countryCode) => {
    try {
        const url = `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&language=en-US&subscription-key=${process.env.Azure_maps_key}&query=${streetAddress}&countrySet=${countryCode}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

module.exports={
    address
}
