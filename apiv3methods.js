// apiv3methods.js

const { v4: uuidv4 } = require('uuid');

const bookings = {};

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

    const slotTimeAvailability = req.slot_time.map(slot_time => {
        return {
            "slot_time": {
                "service_id": slot_time.service_id,
                "start_sec": slot_time.start_sec
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

    const slotAvailable = true; // This should be dynamically checked 
    if (!slotAvailable) {
        return JSON.stringify({
            booking_failure: {
                reason: "SLOT_UNAVAILABLE"
            }
        });
    }

    const bookingId = uuidv4();

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

    // Placeholder: Find the existing booking in the database
    const existingBooking = findBookingById(req.booking.booking_id);

    if (!existingBooking) {
        return JSON.stringify({
            booking_failure: {
                reason: "BOOKING_NOT_FOUND",
                message: "The booking ID provided does not exist."
            }
        });
    }

    // Check if the booking can be canceled or rescheduled
    if (req.booking.status === "CANCELED" && !canBeCancelled(existingBooking)) {
        return JSON.stringify({
            booking_failure: {
                reason: "BOOKING_NOT_CANCELLABLE",
                message: "This booking cannot be canceled."
            }
        });
    }

    // Apply the updates to the booking
    const updatedBooking = {
        ...existingBooking,
        status: req.booking.status || existingBooking.status,
        slot: req.booking.slot || existingBooking.slot,
        party_size: req.booking.party_size || existingBooking.party_size
    };

    // Placeholder: Update the booking in your database
    saveBookingToDatabase(updatedBooking);

    // Placeholder: Check if payment option needs to be updated
    const userPaymentOption = null;
    if (req.booking.status === "CANCELED") {
        // Logic to handle payment updates, e.g., refund or credit
        userPaymentOption = {
            // Populate with relevant payment option details
        };
    }

    // Return the updated booking response
    return JSON.stringify({
        booking: updatedBooking,
        user_payment_option: userPaymentOption
    });
}

// Helper function to check if a booking can be canceled
function canBeCancelled(booking) {
    // Implement  business logic here
    return true; // Assuming the booking can be canceled
}

// Helper function to find a booking by ID
function findBookingById(bookingId) {
    // Implement database lookup logic here
    return {
        booking_id: bookingId,
        status: "CONFIRMED",
        slot: {
            start_time: 1727308800,
            duration: 3600
        },
        party_size: 2
    };
}

// Helper function to save the booking to the database
function saveBookingToDatabase(booking) {
    // Implement your database save logic here
    console.log(`Booking ${booking.booking_id} updated in the database.`);
}


module.exports = {
    HealthCheck,
    BatchAvailabilityLookup,
    CreateBooking,
    UpdateBooking,
};
