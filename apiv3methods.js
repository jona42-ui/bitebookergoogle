// apiv3methods.js

function HealthCheck() {
    const resp = {
        status: "Healthy",
    };
    return JSON.stringify(resp);
}

function BatchAvailabilityLookup(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.slots || !Array.isArray(req.slots)) {
        throw new Error("Invalid request: missing or invalid slots");
    }

    const resp = {
        slots: req.slots.map((slot) => ({
            slot,
            count_available: 1,
            duration_requirement: "DURATION_REQUIREMENT_UNSPECIFIED",
        })),
    };

    return JSON.stringify(resp);
}

function CreateBooking(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.slot || !req.user_information) {
        throw new Error("Invalid request: missing slot or user_information");
    }

    const resp = {
        booking: {
            booking_id: "1234",
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
