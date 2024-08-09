const { loadFeedData, getFeedData } = require('./apimethods.js'); 

async function testLoadData() {
    try {
        await loadFeedData();
        console.log('Feed data loaded successfully');

        const { availabilityData, serviceData, merchantData } = getFeedData();
        console.log('Availability Data:', availabilityData);
        console.log('Service Data:', serviceData);
        console.log('Merchant Data:', merchantData);
    } catch (err) {
        console.error('Error loading feed data:', err);
    }
}

testLoadData();
