require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const zlib = require('zlib');

const sftpConfig = {
    host: 'partnerupload.google.com',
    port: 19321,
    privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    connectTimeout: 900000,
};

const feedUsernames = {
    availability: process.env.VAIL_USERNAME,
    merchants: process.env.MERCHANT_USERNAME,
    services: process.env.SERVICE_USERNAME,
};

const feedPaths = {
    availability: 'availabilityfeed.json.gz',
    merchants: 'merchantfeed.json.gz',
    services: 'servicefeed.json.gz',
};

let availabilityData = {};
let serviceData = {};
let merchantData = {};

async function loadFeedData() {
    for (const [feedType, username] of Object.entries(feedUsernames)) {
        console.log(`Connecting to SFTP for feed type: ${feedType}`);
        const sftp = new Client();
        sftpConfig.username = username;

        try {
            await sftp.connect(sftpConfig);
            console.log(`Connected to SFTP as ${username}`);

            const filePath = feedPaths[feedType];
            const feedStream = await sftp.get(filePath);
            const feedData = await unzipFeed(feedStream);

            console.log(`Data for ${feedType}:`, feedData);

            switch (feedType) {
                case 'availability':
                    availabilityData = feedData;
                    break;
                case 'services':
                    serviceData = feedData;
                    break;
                case 'merchants':
                    merchantData = feedData;
                    break;
            }
        } catch (err) {
            console.error(`Error for feed type ${feedType}:`, err);
        } finally {
            await sftp.end();
        }
    }
}

function unzipFeed(feedStream) {
    return new Promise((resolve, reject) => {
        const unzip = zlib.createGunzip();
        const dataChunks = [];

        feedStream.pipe(unzip)
            .on('data', chunk => dataChunks.push(chunk))
            .on('end', () => {
                const feedData = Buffer.concat(dataChunks).toString();
                console.log('Unzipped Feed Data:', feedData);
                resolve(JSON.parse(feedData));
            })
            .on('error', reject);
    });
}

function getFeedData() {
    return { availabilityData, serviceData, merchantData };
}

function HealthCheck() {
    return JSON.stringify({ status: "Healthy" });
}

function BatchAvailabilityLookup(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.slots || !Array.isArray(req.slots)) {
        throw new Error("Invalid request: missing or invalid slots");
    }

    if (!availabilityData.service_availability || availabilityData.service_availability.length === 0) {
        throw new Error("Availability data is not loaded");
    }

    const resp = {
        slots: req.slots.map(slot => {
            const availableSlot = availabilityData.service_availability.find(availabilityEntry =>
                availabilityEntry.availability.some(avail =>
                    avail.start_sec === slot.start_sec && avail.service_id === slot.service_id
                )
            );

            const slotDetails = availableSlot
                ? availableSlot.availability.find(avail =>
                    avail.start_sec === slot.start_sec && avail.service_id === slot.service_id
                )
                : null;

            return {
                slot: {
                    start_sec: slot.start_sec,
                    service_id: slot.service_id
                },
                count_available: slotDetails ? slotDetails.spots_open : 0,
                duration_requirement: slotDetails ? slotDetails.duration_sec : "DURATION_REQUIREMENT_UNSPECIFIED",
            };
        }),
    };

    return JSON.stringify(resp);
}

function CreateBooking(requestBody) {
    const req = JSON.parse(requestBody);

    if (!req.slot || !req.user_information) {
        throw new Error("Invalid request: missing slot or user_information");
    }

    // Find the slot in availability data
    const availableSlot = availabilityData.service_availability.find(availabilityEntry =>
        availabilityEntry.availability.some(avail =>
            avail.start_sec === req.slot.start_sec && avail.service_id === req.slot.service_id
        )
    );

    const slotDetails = availableSlot
        ? availableSlot.availability.find(avail =>
            avail.start_sec === req.slot.start_sec && avail.service_id === req.slot.service_id
        )
        : null;

    // Check if the slot is available
    if (!slotDetails || slotDetails.spots_open <= 0) {
        throw new Error("SLOT_UNAVAILABLE: The requested slot is no longer available.");
    }

    // Check if the payment method is accepted for the service
    const service = serviceData[req.slot.service_id];
    if (!service || service.payment_methods.indexOf(req.payment_information.method) === -1) {
        throw new Error("PAYMENT_ERROR_CARD_TYPE_REJECTED: The provided credit card type is not accepted.");
    }

    const bookingId = uuidv4();

    // Update availability data by decrementing the slot's spots_open
    slotDetails.spots_open -= 1;

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

    const bookingId = req.booking.booking_id;

    // Find the existing booking in the merchant data
    const existingBooking = merchantData.bookings.find(b => b.booking_id === bookingId);

    if (!existingBooking) {
        throw new Error("BOOKING_NOT_FOUND: The specified booking ID does not exist.");
    }

    // Update the booking status or other details
    existingBooking.status = req.booking.status || "UPDATED";
    if (req.booking.slot) {
        existingBooking.slot = req.booking.slot;
    }
    if (req.booking.payment_information) {
        existingBooking.payment_information = req.booking.payment_information;
    }

    const resp = {
        booking: {
            booking_id: bookingId,
            status: existingBooking.status,
            slot: existingBooking.slot,
            payment_information: existingBooking.payment_information,
        },
    };

    return JSON.stringify(resp);
}


module.exports = {
    HealthCheck,
    BatchAvailabilityLookup,
    CreateBooking,
    UpdateBooking,
    loadFeedData,
    getFeedData
};
