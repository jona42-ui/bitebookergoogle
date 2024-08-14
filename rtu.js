require("dotenv").config();

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Load service account credentials
const keyFilePath = process.env.GOOGLE_KEYFILE_PATH;

if (!keyFilePath) {
    throw new Error("Environment variable GOOGLE_KEYFILE_PATH is not set.");
}

// Create a GoogleAuth instance
const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(keyFilePath),
    scopes: ['https://www.googleapis.com/auth/mapsbooking']
});

async function sendBookingNotification(bookingId, status) {
    try {
        // Obtain an authenticated client
        const authClient = await auth.getClient();
        
        const url = `https://partnerdev-mapsbooking.googleapis.com/v1alpha/notification/partners/20002201/bookings/${bookingId}`;
        const payload = {
            name: `partners/20002201/bookings/${bookingId}`, 
            status: status
        };

        const res = await authClient.request({
            url: url,
            method: 'PATCH',
            data: payload
        });

        console.log(`Sent notification for booking ${bookingId}:`, res.data);
    } catch (error) {
        console.error(`Failed to send notification for booking ${bookingId}:`, error);
    }
}

module.exports = { sendBookingNotification };
