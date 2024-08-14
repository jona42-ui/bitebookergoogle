// apiv3methods.js
const { sendBookingNotification } = require('./rtu.js');

const { v4: uuidv4 } = require('uuid');

const bookings = {};

function HealthCheck() {
    const resp = {
        status: "Healthy",
    };
    return JSON.stringify(resp);
}

function BatchAvailabilityLookup(requestBody) {
    console.log("request body:",requestBody);
    const req = JSON.parse(requestBody);

    if (!req.slot_time || !Array.isArray(req.slot_time)) {
        throw new Error("Invalid request: missing or invalid slots time");
    }

    console.log("request body:",req);

    const slotTimeAvailability = req.slot_time.map(slot_time => {
        return {
            "available": true,
            "slot_time": {
                "duration_sec": slot_time.duration_sec,
                "resource_ids": {
                    "party_size": slot_time.resource_ids.party_size
                },
                "service_id": slot_time.service_id,
                "start_sec": slot_time.start_sec
            }
        };
    }); 


    // Define the response object
    const response = {
        "slot_time_availability": slotTimeAvailability
    };

    // Convert the response object to a JSON string
    const jsonResponse = JSON.stringify(response);

    // Print the JSON response
    console.log("response body:",jsonResponse);

    return jsonResponse;
}

//https://developers.google.com/actions-center/verticals/appointments/e2e/reference/booking-server-api-rest/e2e-methods/createbooking-method

function CreateBooking(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.slot || !req.user_information || !req.idempotency_token) {
        throw new Error("Invalid request: missing required fields (slot, user_information, idempotency_token)");
    }

    // Check if booking already exists for the given idempotency token
    if (bookings[req.idempotency_token]) {
        // Return existing booking to enforce idempotency
        return JSON.stringify({
            booking: bookings[req.idempotency_token]
        });
    }

    const slotAvailable = true; 
    if (!slotAvailable) {
        return JSON.stringify({
            booking_failure: {
                reason: "SLOT_UNAVAILABLE"
            }
        });
    }

    const bookingId = uuidv4();

    console.log("Received user_information:", req.user_information);


    const booking = {
        booking_id: bookingId,
        slot: req.slot,
        user_information: req.user_information,
        status: "CONFIRMED",
    };


    bookings[req.idempotency_token] = booking;

    return JSON.stringify({
        booking: booking
    });
}

//https://developers.google.com/actions-center/verticals/appointments/e2e/reference/booking-server-api-rest/e2e-methods/updatebooking-method


function UpdateBooking(requestBody) {
    const req = JSON.parse(requestBody);

    // Validate that booking and booking_id are present
    if (!req.booking || !req.booking.booking_id) {
        return JSON.stringify({
            booking_failure: {
                reason: "INVALID_REQUEST",
                message: "Missing booking or booking_id."
            }
        });
    }

    // Ensure that slot and resources objects are defined
    const slot = req.booking.slot || {};
    const resources = slot.resources || {};

    // Generate the dynamic response based on the incoming request
    const responseBooking = {
        booking_id: req.booking.booking_id,
        status: req.booking.status || "CONFIRMED",  
        slot: {
            duration_sec: slot.duration_sec || 1800,  
            merchant_id: slot.merchant_id || "1234",  
            service_id: slot.service_id || "5678",    
            start_sec: slot.start_sec || 1606473000,  
            resources: {
                party_size: resources.party_size || 2  
            }
        },
        payment_information: {
            prepayment_status: req.booking.payment_information?.prepayment_status || "PREPAYMENT_NOT_PROVIDED"
        },
        user_information: {
            user_id: req.booking.user_information?.user_id || "1111111111111111111",
            email: req.booking.user_information?.email || "john.smith@gmail.com",
            given_name: req.booking.user_information?.given_name || "John",
            family_name: req.booking.user_information?.family_name || "Smith",
            telephone: req.booking.user_information?.telephone || "+12091111111"
        }
    };

    // Send real-time update notification
    sendBookingNotification(req.booking.booking_id, responseBooking.status);

    return JSON.stringify({
        booking: responseBooking
    });
}

module.exports = {
    HealthCheck,
    BatchAvailabilityLookup,
    CreateBooking,
    UpdateBooking,
};
