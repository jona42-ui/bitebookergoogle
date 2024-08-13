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


    // {
    //     "slot_time_availability": [
    //         {
    //             "available": true,
    //             "slot_time": {
    //                 "duration_sec": "1800",
    //                 "resource_ids": {
    //                     "party_size": 2
    //                 },
    //                 "service_id": "5678",
    //                 "start_sec": "1606467600"
    //             }
    //         }
    //     ]
    // }

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

// function UpdateBooking(requestBody) {
//     const req = JSON.parse(requestBody);

//     // Validate that booking and booking_id are present
//     if (!req.booking || !req.booking.booking_id) {
//         return JSON.stringify({
//             booking_failure: {
//                 reason: "INVALID_REQUEST",
//                 message: "Missing booking or booking_id."
//             }
//         });
//     }

    // Placeholder: Find the existing booking in the database
    // const existingBooking = findBookingById(req.booking.booking_id);

    // if (!existingBooking) {
    //     return JSON.stringify({
    //         booking_failure: {
    //             reason: "BOOKING_NOT_FOUND",
    //             message: "The booking ID provided does not exist."
    //         }
    //     });
    // }

    // Check if the booking can be canceled or rescheduled
    // if (req.booking.status === "CANCELED" && !canBeCancelled(existingBooking)) {
    //     return JSON.stringify({
    //         booking_failure: {
    //             reason: "BOOKING_NOT_CANCELLABLE",
    //             message: "This booking cannot be canceled."
    //         }
    //     });
    // }

    // const updatedBooking = {
    //     ...existingBooking,
    //     status: req.booking.status || existingBooking.status,
    //     slot: req.booking.slot || existingBooking.slot,
    //     party_size: req.booking.party_size || existingBooking.party_size
    // };

    // Placeholder: Update the booking in our database
    // saveBookingToDatabase(updatedBooking);

    // Placeholder: Check if payment option needs to be updated
    // let userPaymentOption = null; // Changed from const to let
    // if (req.booking.status === "CANCELED") {
        // Logic to handle payment updates, e.g., refund or credit
        // userPaymentOption = {
            // Populate with relevant payment option details
    //     };
    // }

//     return JSON.stringify({
//         booking: updatedBooking,
//         user_payment_option: userPaymentOption
//     });
// }

// Helper function to check if a booking can be canceled
// function canBeCancelled(booking) {
    // Implement  business logic here
    // return true; // Assuming the booking can be canceled
// }

// Helper function to find a booking by ID
// function findBookingById(bookingId) {
    // Implement database lookup logic here
//     return {
//         booking_id: bookingId,
//         status: "CONFIRMED",
//         slot: {
//             start_time: 1727308800,
//             duration: 3600
//         },
//         party_size: 2
//     };
// }

// Helper function to save the booking to the database
// function saveBookingToDatabase(booking) {
    // Implement your database save logic here
//     console.log(`Booking ${booking.booking_id} updated in the database.`);
// }


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

    // Generate the dynamic response based on the incoming request
    const responseBooking = {
        booking_id: req.booking.booking_id,
        status: req.booking.status || "CONFIRMED",  
        slot: {
            duration_sec: req.booking.slot.duration_sec || 1800,  
            merchant_id: req.booking.slot.merchant_id || "1234",  
            service_id: req.booking.slot.service_id || "5678",    
            start_sec: req.booking.slot.start_sec || 1606473000,  
            resources: {
                party_size: req.booking.slot.resources?.party_size || 2 
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
