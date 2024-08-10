// apiv3methods.js

const { v4: uuidv4 } = require('uuid');

function HealthCheck() {
    const resp = {
        status: "Healthy",
    };
    return JSON.stringify(resp);
}

function BatchAvailabilityLookup(requestBody) {

    const req = JSON.parse(requestBody);

    if (!req.slot_time || !Array.isArray(req.slot_time)) {
        throw new Error("Invalid request: missing or invalid slots time");
    }

    console.log("request body:",req);
    console.log( "service_id:", req.slot_time[0].service_id);

    // Create the slot_time_availability array using a loop
    const slotTimeAvailability = req.slot_time.map(slot_time => {
        return {
            "slot_time": {
                "service_id": req.slot_time.service_id,
                "start_sec": req.slot_time.start_sec
            },
            "available": true
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

function CreateBooking(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.slot || !req.user_information) {
        throw new Error("Invalid request: missing slot or user_information");
    }

    const bookingId = uuidv4();

    const resp = {
        booking: {
            booking_id: bookingId,
            slot: req.slot,
            user_information: { user_id: req.user_information.user_id },
            payment_information: req.payment_information,
            status: "CONFIRMED",
        },
    };

    return JSON.stringify(resp);
}

function UpdateBooking(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.booking || !req.booking.booking_id) {
        throw new Error("Invalid request: missing booking or booking_id");
    }

    const resp = {
        booking: {
            booking_id: req.booking.booking_id,
            status: req.booking.status || "UPDATED",
        },
    };

    return JSON.stringify(resp);
}

module.exports = {
    HealthCheck,
    BatchAvailabilityLookup,
    CreateBooking,
    UpdateBooking,
};
